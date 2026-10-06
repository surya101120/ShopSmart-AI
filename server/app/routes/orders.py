import uuid, datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.models.cart import Cart
from app.models.product import Product
from app.models.coupon import Coupon
from app.models.user import User
from app.services.email_service import send_order_confirmation_email
from app.utils.helpers import paginate_query
from app.extensions import db

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json() or {}

    
    print("========== ORDER DEBUG ==========")
    print("ORDER DATA:", data)
    print("USER ID:", user_id)

    

    cart_items = Cart.query.filter_by(user_id=user_id).all()
    print("CART ITEMS:", len(cart_items))
    for item in cart_items:
        product = Product.query.get(item.product_id)
        print(
            "PRODUCT:", item.product_id,
            product.name if product else None,
            "ACTIVE:", product.is_active if product else None,
            "STOCK:", product.stock if product else None,
            "QTY:", item.quantity
        )

    print("================================")


    shipping_address = data.get("shipping_address")
    print("SHIPPING ADDRESS:", shipping_address)

    
    payment_method = data.get('payment_method', 'stripe')
    coupon_code = data.get('coupon_code')
    notes = data.get('notes')

    if not shipping_address:
        return jsonify({"success": False, "message": "Shipping address is required"}), 400

    cart_items = Cart.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({"success": False, "message": "Your cart is empty"}), 400

    subtotal = 0.0
    order_items_data = []

    for item in cart_items:
        product = Product.query.get(item.product_id)
        if not product or not product.is_active:
            return jsonify({"success": False, "message": f"Product '{item.product_id}' unavailable"}), 400

        if product.stock < item.quantity:
            return jsonify({"success": False, "message": f"Insufficient stock for product '{product.name}'"}), 400

        item_total = float(product.price) * item.quantity
        subtotal += item_total
        order_items_data.append({
            "product": product,
            "quantity": item.quantity,
            "color": item.color,
            "size": item.size,
            "unit_price": float(product.price),
            "total_price": item_total
        })

    discount_amount = 0.0
    coupon_obj = None
    if coupon_code:
        coupon_obj = Coupon.query.filter_by(code=coupon_code.upper(), is_active=True).first()
        if coupon_obj:
            if coupon_obj.discount_type == 'percentage':
                discount_amount = round(subtotal * (float(coupon_obj.discount_value) / 100.0), 2)
                if coupon_obj.max_discount:
                    discount_amount = min(discount_amount, float(coupon_obj.max_discount))
            else:
                discount_amount = min(float(coupon_obj.discount_value), subtotal)
            coupon_obj.used_count += 1

    gst_amount = round((subtotal - discount_amount) * 0.18, 2)
    shipping_cost = 0.0 if subtotal > 500 else 49.0
    total_amount = round((subtotal - discount_amount) + gst_amount + shipping_cost, 2)

    order_number = f"ORD-{datetime.datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

    order = Order(
        user_id=user_id,
        order_number=order_number,
        status=OrderStatus.CONFIRMED if payment_method == 'cod' else OrderStatus.PENDING,
        subtotal=round(subtotal, 2),
        discount_amount=discount_amount,
        coupon_id=coupon_obj.id if coupon_obj else None,
        shipping_cost=shipping_cost,
        gst_amount=gst_amount,
        total_amount=total_amount,
        payment_method=payment_method,
        payment_status=PaymentStatus.PAID if payment_method == 'cod' else PaymentStatus.PENDING,
        shipping_address=shipping_address,
        notes=notes,
        estimated_delivery=datetime.date.today() + datetime.timedelta(days=5)
    )

    db.session.add(order)
    db.session.flush()

    for oi in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            product_id=oi["product"].id,
            product_name=oi["product"].name,
            product_sku=oi["product"].sku,
            thumbnail=oi["product"].thumbnail,
            quantity=oi["quantity"],
            unit_price=oi["unit_price"],
            total_price=oi["total_price"],
            color=oi["color"],
            size=oi["size"]
        )
        db.session.add(order_item)
        # Update product stock & sold count
    # Clear cart
    Cart.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    if user:
        send_order_confirmation_email(user.email, order)

    return jsonify({
        "success": True,
        "message": "Order created successfully",
        "data": order.to_dict()
    }), 201

@orders_bp.route('/orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    q = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc())
    result = paginate_query(q, page=page, per_page=per_page)
    return jsonify({"success": True, "data": result}), 200

@orders_bp.route('/orders/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    user_id = get_jwt_identity()

    print("========== GET ORDER DEBUG ==========")
    print("ORDER ID FROM URL:", order_id)
    print("JWT USER ID:", user_id)

    order = Order.query.filter_by(id=order_id).first()

    print("ORDER FOUND:", order)

    if order:
        print("ORDER DATABASE ID:", order.id)
        print("ORDER USER ID:", order.user_id)
        print("ORDER NUMBER:", order.order_number)

    print("=====================================")

    if not order:
        return jsonify({
            "success": False,
            "message": "Order not found"
        }), 404

    if str(order.user_id) != str(user_id):
        return jsonify({
            "success": False,
            "message": "You are not authorized to view this order"
        }), 403

    return jsonify({
        "success": True,
        "data": order.to_dict()
    }), 200


@orders_bp.route('/orders/<int:order_id>/cancel', methods=['PUT'])
@jwt_required()
def cancel_order(order_id):
    user_id = get_jwt_identity()

    order = Order.query.filter_by(
        id=order_id,
        user_id=user_id
    ).first()

    if not order:
        return jsonify({
            "success": False,
            "message": "Order not found"
        }), 404

    if order.status == OrderStatus.CANCELLED:
        return jsonify({
            "success": False,
            "message": "Order is already cancelled"
        }), 400

    if order.status == OrderStatus.DELIVERED:
        return jsonify({
            "success": False,
            "message": "Delivered orders cannot be cancelled"
        }), 400

    order.status = OrderStatus.CANCELLED

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Order cancelled successfully",
        "data": order.to_dict()
    }), 200

@orders_bp.route('/orders/track/<order_number>', methods=['GET'])
def track_order(order_number):
    order = Order.query.filter_by(order_number=order_number).first()
    if not order:
        return jsonify({"success": False, "message": "Order not found"}), 404
    return jsonify({
        "success": True,
        "data": {
            "order_number": order.order_number,
            "status": order.status.value if order.status else None,
            "payment_status": order.payment_status.value if order.payment_status else None,
            "created_at": order.created_at.isoformat() if order.created_at else None,
            "estimated_delivery": order.estimated_delivery.isoformat() if order.estimated_delivery else None,
            "tracking_number": order.tracking_number,
            "items_count": len(order.items)
        }
    }), 200
