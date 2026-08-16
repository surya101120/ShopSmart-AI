from flask import current_app
from flask_mail import Message
from app.extensions import mail

def send_email(subject, recipient, html_body):
    """Generic email sender using Flask-Mail."""

    try:
        print("\n========== EMAIL DEBUG ==========")
        print("RECIPIENT:", recipient)
        print("SUBJECT:", subject)
        print("MAIL USERNAME:", current_app.config.get("MAIL_USERNAME"))
        print("MAIL SERVER:", current_app.config.get("MAIL_SERVER"))
        print("MAIL PORT:", current_app.config.get("MAIL_PORT"))

        if not current_app.config.get("MAIL_USERNAME"):
            print("ERROR: MAIL_USERNAME is missing")
            return False

        msg = Message(
            subject=subject,
            recipients=[recipient],
            html=html_body,
            sender=current_app.config.get(
                "MAIL_DEFAULT_SENDER",
                current_app.config.get("MAIL_USERNAME")
            )
        )

        print("MESSAGE CREATED")
        print("SENDING EMAIL...")

        mail.send(msg)

        print("EMAIL SENT SUCCESSFULLY ✅")
        print("================================\n")

        return True

    except Exception as e:
        print("\n========== EMAIL ERROR ==========")
        print("ERROR:", repr(e))
        print("================================\n")
        return False

def send_order_confirmation_email(user_email, order):
    subject = f"Order Confirmed #{order.order_number} - ShopSmart AI"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #4F46E5;">Thank you for your order!</h2>
        <p>Your order <strong>#{order.order_number}</strong> has been successfully placed.</p>
        <p>Total Amount: <strong>₹{float(order.total_amount):,.2f}</strong></p>
        <p>Payment Method: <strong>{order.payment_method.upper()}</strong></p>
        <hr/>
        <p style="color: #6B7280; font-size: 12px;">ShopSmart AI - Intelligent E-Commerce Platform</p>
    </div>
    """
    return send_email(subject, user_email, html)

def send_shipping_update_email(user_email, order):
    subject = f"Order #{order.order_number} Status Updated: {order.status.upper()}"
    html = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="color: #4F46E5;">Order Status Update</h2>
        <p>Your order <strong>#{order.order_number}</strong> is now: <strong>{order.status.upper()}</strong>.</p>
        {f'<p>Tracking Number: <strong>{order.tracking_number}</strong></p>' if order.tracking_number else ''}
        <hr/>
        <p style="color: #6B7280; font-size: 12px;">ShopSmart AI</p>
    </div>
    """
    return send_email(subject, user_email, html)
