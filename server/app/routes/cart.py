from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.cart import Cart
from app.models.product import Product
from app.models.coupon import Coupon
from app.extensions import db

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    user_id = get_jwt_identity()
    cart_items = Cart.query.filter_by(user_id=user_id).all()
    
    items = []
    subtotal = 0.0
    for ci in cart_items:
        item_dict = ci.to_dict()
        subtotal += item_dict.get('line_total', 0) 
        items.append(item_dict)

    gst_amount = round(subtotal * 0.18, 2)
    shipping_cost = 0.0 if subtotal > 500 or subtotal == 0 else 49.0
    total_amount = round(subtotal + gst_amount + shipping_cost, 2)

    return jsonify({
        "success": True,
        "data": {
            "items": items,
            "subtotal": round(subtotal, 2),
            "gst_amount": gst_amount,
            "shipping_cost": shipping_cost,
            "total_amount": total_amount,
            "item_count": sum(ci.quantity for ci in cart_items)
        }
    }), 200

@cart_bp.route('/cart', methods=['POST'])
@jwt_required()
def add_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)
    color = data.get('color')
    size = data.get('size')

    if not product_id:
        return jsonify({"success": False, "message": "Product ID is required"}), 400

    product = Product.query.get(product_id)
    if not product or not product.is_active:
        return jsonify({"success": False, "message": "Product not available"}), 404

    existing = Cart.query.filter_by(
        user_id=user_id,
        product_id=product_id,
        color=color,
        size=size
    ).first()

    if existing:
        existing.quantity += quantity
    else:
        cart_item = Cart(
            user_id=user_id,
            product_id=product_id,
            quantity=quantity,
            color=color,
            size=size
        )
        db.session.add(cart_item)

    db.session.commit()
    return jsonify({"success": True, "message": "Product added to cart"}), 200

@cart_bp.route('/cart/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    quantity = data.get('quantity')

    item = Cart.query.filter_by(id=item_id, user_id=user_id).first()
    if not item:
        return jsonify({"success": False, "message": "Cart item not found"}), 404

    if quantity <= 0:
        db.session.delete(item)
    else:
        item.quantity = quantity

    db.session.commit()
    return jsonify({"success": True, "message": "Cart updated"}), 200

@cart_bp.route('/cart/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(item_id):
    user_id = get_jwt_identity()
    item = Cart.query.filter_by(id=item_id, user_id=user_id).first()
    if not item:
        return jsonify({"success": False, "message": "Cart item not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"success": True, "message": "Item removed from cart"}), 200

@cart_bp.route('/cart', methods=['DELETE'])
@jwt_required()
def clear_cart():
    user_id = get_jwt_identity()
    Cart.query.filter_by(user_id=user_id).delete()
    db.session.commit()
    return jsonify({"success": True, "message": "Cart cleared"}), 200
