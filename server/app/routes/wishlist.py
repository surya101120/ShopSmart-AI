from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.wishlist import Wishlist
from app.models.cart import Cart
from app.models.product import Product
from app.extensions import db

wishlist_bp = Blueprint('wishlist', __name__)

@wishlist_bp.route('/wishlist', methods=['GET'])
@jwt_required()
def get_wishlist():
    user_id = get_jwt_identity()
    wish_items = Wishlist.query.filter_by(user_id=user_id).all()
    return jsonify({
        "success": True,
        "data": [item.to_dict() for item in wish_items]
    }), 200

@wishlist_bp.route('/wishlist', methods=['POST'])
@jwt_required()
def add_to_wishlist():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    product_id = data.get('product_id')

    if not product_id:
        return jsonify({"success": False, "message": "Product ID required"}), 400

    existing = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing:
        return jsonify({"success": True, "message": "Product already in wishlist"}), 200

    item = Wishlist(user_id=user_id, product_id=product_id)
    db.session.add(item)
    db.session.commit()
    return jsonify({"success": True, "message": "Product added to wishlist"}), 201

@wishlist_bp.route('/wishlist/<int:product_id>', methods=['DELETE'])
@jwt_required()
def remove_from_wishlist(product_id):
    user_id = get_jwt_identity()
    item = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()
    if not item:
        return jsonify({"success": False, "message": "Wishlist item not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"success": True, "message": "Product removed from wishlist"}), 200

@wishlist_bp.route('/wishlist/move-to-cart', methods=['POST'])
@jwt_required()
def move_to_cart():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    product_id = data.get('product_id')

    w_item = Wishlist.query.filter_by(user_id=user_id, product_id=product_id).first()
    if w_item:
        db.session.delete(w_item)

    c_item = Cart.query.filter_by(user_id=user_id, product_id=product_id).first()
    if c_item:
        c_item.quantity += 1
    else:
        c_item = Cart(user_id=user_id, product_id=product_id, quantity=1)
        db.session.add(c_item)

    db.session.commit()
    return jsonify({"success": True, "message": "Moved product to cart"}), 200
