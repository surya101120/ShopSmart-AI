import os, stripe, datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.order import Order
from app.models.payment import Payment
from app.extensions import db

payments_bp = Blueprint('payments', __name__)
stripe.api_key = os.getenv('STRIPE_SECRET_KEY', 'sk_test_mock_key')

@payments_bp.route('/payments/create-intent', methods=['POST'])
@jwt_required()
def create_payment_intent():
    data = request.get_json() or {}
    order_id = data.get('order_id')

    if not order_id:
        return jsonify({"success": False, "message": "Order ID is required"}), 400

    order = Order.query.get(order_id)
    if not order:
        return jsonify({"success": False, "message": "Order not found"}), 404

    # Amount in smallest currency unit (paise for INR, cents for USD)
    amount_in_paise = int(round(float(order.total_amount) * 100))

    try:
        if stripe.api_key and not stripe.api_key.startswith('sk_test_mock'):
            intent = stripe.PaymentIntent.create(
                amount=amount_in_paise,
                currency='inr',
                metadata={'order_id': order.id, 'order_number': order.order_number}
            )
            client_secret = intent.client_secret
            payment_id = intent.id
        else:
            client_secret = f"pi_mock_secret_{order.id}"
            payment_id = f"pi_mock_{order.id}"

        payment = Payment.query.filter_by(order_id=order.id).first()
        if not payment:
            payment = Payment(
                order_id=order.id,
                stripe_payment_id=payment_id,
                stripe_client_secret=client_secret,
                amount=order.total_amount,
                currency='inr',
                status='pending'
            )
            db.session.add(payment)
        else:
            payment.stripe_payment_id = payment_id
            payment.stripe_client_secret = client_secret

        db.session.commit()

        return jsonify({
            "success": True,
            "data": {
                "client_secret": client_secret,
                "payment_id": payment_id,
                "amount": order.total_amount
            }
        }), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@payments_bp.route('/payments/confirm', methods=['POST'])
@jwt_required()
def confirm_payment():
    data = request.get_json() or {}
    order_id = data.get('order_id')
    payment_id = data.get('payment_id')

    order = Order.query.get(order_id)
    if not order:
        return jsonify({"success": False, "message": "Order not found"}), 404

    order.payment_status = 'paid'
    order.status = 'confirmed'

    payment = Payment.query.filter_by(order_id=order_id).first()
    if payment:
        payment.status = 'succeeded'
        payment.paid_at = datetime.datetime.utcnow()

    db.session.commit()

    return jsonify({"success": True, "message": "Payment confirmed", "order": order.to_dict()}), 200
