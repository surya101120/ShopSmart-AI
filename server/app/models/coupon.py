"""
ShopSmart AI - Coupon Model
"""

from datetime import datetime, timezone
from app.extensions import db


class Coupon(db.Model):
    __tablename__ = 'coupons'

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False, index=True)
    description = db.Column(db.String(255), nullable=True)
    discount_type = db.Column(
        db.Enum('percentage', 'fixed', name='discount_type_enum'),
        nullable=False,
        default='percentage',
    )
    discount_value = db.Column(db.Numeric(10, 2), nullable=False)
    min_order_amount = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    max_discount = db.Column(db.Numeric(10, 2), nullable=True)  # Cap for percentage discounts
    usage_limit = db.Column(db.Integer, nullable=True)  # NULL = unlimited
    used_count = db.Column(db.Integer, default=0, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False, index=True)
    starts_at = db.Column(db.DateTime(timezone=True), nullable=True)
    expires_at = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def __repr__(self):
        return f'<Coupon {self.code}>'

    def validate(self, order_amount: float) -> float:
        """
        Validate coupon against order_amount.

        Returns the discount amount if valid.
        Raises ValueError with a user-facing message if invalid.
        """
        now = datetime.now(timezone.utc)

        if not self.is_active:
            raise ValueError('This coupon is not active.')

        if self.starts_at:
            starts = self.starts_at if self.starts_at.tzinfo else self.starts_at.replace(tzinfo=timezone.utc)
            if now < starts:
                raise ValueError('This coupon is not yet valid.')

        if self.expires_at:
            expires = self.expires_at if self.expires_at.tzinfo else self.expires_at.replace(tzinfo=timezone.utc)
            if now > expires:
                raise ValueError('This coupon has expired.')

        if self.usage_limit is not None and self.used_count >= self.usage_limit:
            raise ValueError('This coupon has reached its usage limit.')

        min_amount = float(self.min_order_amount or 0)
        if order_amount < min_amount:
            raise ValueError(
                f'Minimum order amount of ₹{min_amount:.2f} required for this coupon.'
            )

        # Calculate discount
        if self.discount_type == 'percentage':
            discount = round(order_amount * float(self.discount_value) / 100, 2)
            if self.max_discount:
                discount = min(discount, float(self.max_discount))
        else:
            discount = min(float(self.discount_value), order_amount)

        return discount

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'code': self.code,
            'description': self.description,
            'discount_type': self.discount_type,
            'discount_value': float(self.discount_value),
            'min_order_amount': float(self.min_order_amount),
            'max_discount': float(self.max_discount) if self.max_discount else None,
            'usage_limit': self.usage_limit,
            'used_count': self.used_count,
            'is_active': self.is_active,
            'starts_at': self.starts_at.isoformat() if self.starts_at else None,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
