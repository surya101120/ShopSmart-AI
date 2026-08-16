"""
ShopSmart AI - Payment Model
"""

from datetime import datetime, timezone
from app.extensions import db


class Payment(db.Model):
    __tablename__ = 'payments'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False, unique=True, index=True)
    stripe_payment_id = db.Column(db.String(255), nullable=True, unique=True, index=True)
    stripe_client_secret = db.Column(db.String(512), nullable=True)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    currency = db.Column(db.String(10), default='inr', nullable=False)
    status = db.Column(
        db.Enum('pending', 'succeeded', 'failed', 'cancelled', 'refunded', name='payment_status_enum'),
        default='pending',
        nullable=False,
        index=True,
    )
    method = db.Column(db.String(50), nullable=True)  # card, upi, netbanking, cod
    payment_metadata = db.Column("metadata", db.JSON, default=dict)
    paid_at = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    order = db.relationship('Order', back_populates='payment')

    def __repr__(self):
        return f'<Payment order={self.order_id} status={self.status}>'

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'order_id': self.order_id,
            'stripe_payment_id': self.stripe_payment_id,
            'amount': float(self.amount),
            'currency': self.currency,
            'status': self.status,
            'method': self.method,
            'metadata': self.payment_metadata or {},
            'paid_at': self.paid_at.isoformat() if self.paid_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
