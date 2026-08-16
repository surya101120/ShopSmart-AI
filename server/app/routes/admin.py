from flask import Blueprint, request, jsonify
from app.models.product import Product
from app.models.category import Category
from app.models.order import Order
from app.models.user import User
from app.models.coupon import Coupon
from app.services.email_service import send_shipping_update_email
from app.utils.helpers import admin_required, paginate_query, slugify
from app.extensions import db
from sqlalchemy import func

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required()
def get_dashboard_kpis():
    total_orders = Order.query.filter(Order.status != 'cancelled').count()
    total_revenue = db.session.query(func.sum(Order.total_amount)).filter(Order.payment_status == 'paid').scalar() or 0.0
    total_users = User.query.filter_by(is_active=True).count()
    total_products = Product.query.filter_by(is_active=True).count()
    low_stock_products = Product.query.filter(Product.stock <= Product.low_stock_alert).count()

    recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()

    return jsonify({
        "success": True,
        "data": {
            "kpis": {
                "total_revenue": round(float(total_revenue), 2),
                "total_orders": total_orders,
                "total_users": total_users,
                "total_products": total_products,
                "low_stock_alerts": low_stock_products
            },
            "recent_orders": [o.to_dict() for o in recent_orders]
        }
    }), 200

@admin_bp.route('/products', methods=['GET'])
@admin_required()
def admin_get_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    q = Product.query.order_by(Product.created_at.desc())
    return jsonify({"success": True, "data": paginate_query(q, page=page, per_page=per_page)}), 200

@admin_bp.route('/products', methods=['POST'])
@admin_required()
def admin_create_product():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    category_id = data.get('category_id')
    price = data.get('price')

    if not name or not category_id or not price:
        return jsonify({"success": False, "message": "Name, category, and price are required"}), 400

    slug = slugify(name)
    existing = Product.query.filter_by(slug=slug).first()
    if existing:
        slug = f"{slug}-{Product.query.count() + 1}"

    product = Product(
        category_id=category_id,
        name=name,
        slug=slug,
        description=data.get('description'),
        short_description=data.get('short_description'),
        brand=data.get('brand'),
        sku=data.get('sku', f"SKU-{Product.query.count() + 100}"),
        price=price,
        original_price=data.get('original_price', price),
        discount_percent=data.get('discount_percent', 0),
        stock=data.get('stock', 10),
        low_stock_alert=data.get('low_stock_alert', 5),
        thumbnail=data.get('thumbnail', 'https://via.placeholder.com/400'),
        images=data.get('images', []),
        tags=data.get('tags', []),
        specifications=data.get('specifications', {}),
        is_active=data.get('is_active', True),
        is_featured=data.get('is_featured', False)
    )

    db.session.add(product)
    db.session.commit()

    return jsonify({"success": True, "message": "Product created successfully", "data": product.to_dict()}), 201

@admin_bp.route('/products/<int:id>', methods=['PUT'])
@admin_required()
def admin_update_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404

    data = request.get_json() or {}
    for field in ['name', 'brand', 'price', 'original_price', 'discount_percent', 'stock', 'description', 'short_description', 'thumbnail', 'is_active', 'is_featured']:
        if field in data:
            setattr(product, field, data[field])

    db.session.commit()
    return jsonify({"success": True, "message": "Product updated", "data": product.to_dict()}), 200

@admin_bp.route('/products/<int:id>', methods=['DELETE'])
@admin_required()
def admin_delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404

    db.session.delete(product)
    db.session.commit()
    return jsonify({"success": True, "message": "Product deleted"}), 200

@admin_bp.route('/orders', methods=['GET'])
@admin_required()
def admin_get_orders():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    q = Order.query.order_by(Order.created_at.desc())
    return jsonify({"success": True, "data": paginate_query(q, page=page, per_page=per_page)}), 200

@admin_bp.route('/orders/<int:id>/status', methods=['PUT'])
@admin_required()
def admin_update_order_status(id):
    order = Order.query.get(id)

    if not order:
        return jsonify({
            "success": False,
            "message": "Order not found"
        }), 404

    data = request.get_json() or {}
    status = data.get('status')

    if status:
        order.status = status

        if status == 'delivered':
            order.payment_status = 'paid'

        db.session.commit()

        user = User.query.get(order.user_id)

        if user and user.email:
            send_shipping_update_email(user.email, order)

    return jsonify({
        "success": True,
        "message": "Order status updated",
        "data": order.to_dict()
    }), 200