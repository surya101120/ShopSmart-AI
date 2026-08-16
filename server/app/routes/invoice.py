from flask import Blueprint, send_file, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.order import Order
from app.services.pdf_generator import generate_invoice_pdf

invoice_bp = Blueprint('invoice', __name__)

@invoice_bp.route('/invoice/<int:order_id>', methods=['GET'])
@jwt_required()
def download_invoice(order_id):
    user_id = get_jwt_identity()
    order = Order.query.filter_by(id=order_id).first()

    if not order:
        return jsonify({"success": False, "message": "Order not found"}), 404

    pdf_buffer = generate_invoice_pdf(order)

    return send_file(
        pdf_buffer,
        as_attachment=True,
        download_name=f"Invoice_{order.order_number}.pdf",
        mimetype='application/pdf'
    )
