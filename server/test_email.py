from flask import Flask
from flask_mail import Message
from app import create_app
from app.extensions import mail

app = create_app()

with app.app_context():
    msg = Message(
        subject="ShopSmart AI - Test Email",
        recipients=["suryamuniswamy3@gmail.com"]
    )

    msg.body = """
Hello,

This is a test email from ShopSmart AI.

If you received this email, Gmail SMTP configuration is working.

Regards,
ShopSmart AI
"""

    mail.send(msg)

print("EMAIL SENT SUCCESSFULLY")