from flask import Blueprint, request, jsonify
from app.models.coupon import Coupon

coupons_bp = Blueprint('coupons', __name__)

@coupons_bp.route('/coupons/validate', methods=['POST'])
def validate_coupon():
    data = request.get_json() or {}
    code = data.get('code', '').strip().upper()
    subtotal = float(data.get('subtotal', 0))

    if not code:
        return jsonify({"success": False, "message": "Coupon code is required"}), 400

    coupon = Coupon.query.filter_by(code=code, is_active=True).first()
    if not coupon:
        return jsonify({"success": False, "message": "Invalid or expired coupon code"}), 404

    if coupon.min_order_amount and subtotal < float(coupon.min_order_amount):
        return jsonify({
            "success": False,
            "message": f"Minimum order amount of ₹{float(coupon.min_order_amount):,.2f} required for this coupon"
        }), 400

    if coupon.discount_type == 'percentage':
        discount = round(subtotal * (float(coupon.discount_value) / 100.0), 2)
        if coupon.max_discount:
            discount = min(discount, float(coupon.max_discount))
    else:
        discount = min(float(coupon.discount_value), subtotal)

    return jsonify({
        "success": True,
        "message": "Coupon applied successfully",
        "data": {
            "code": coupon.code,
            "discount_type": coupon.discount_type,
            "discount_value": float(coupon.discount_value),
            "discount_amount": discount
        }
    }), 200

@coupons_bp.route('/coupons/active', methods=['GET'])
def get_active_coupons():
    coupons = Coupon.query.filter_by(is_active=True).all()
    return jsonify({"success": True, "data": [c.to_dict() for c in coupons]}), 200
