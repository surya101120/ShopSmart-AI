"""
ShopSmart AI - Order and OrderItem Models
"""

import random
import string
from datetime import datetime, timezone
from app.extensions import db
import enum


class OrderStatus(str, enum.Enum):
    PENDING = 'PENDING'
    CONFIRMED = 'CONFIRMED'
    PROCESSING = 'PROCESSING'
    SHIPPED = 'SHIPEED'
    OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY'
    DELIVERED = 'DELIVERED'
    CANCELLED = 'CANCELLED'
    REFUNDED = 'REFUNDED'
    FAILED = 'FAILED'


class PaymentStatus(str, enum.Enum):
    PENDING = 'PENDING'
    PAID ='PAID'
    FAILED = 'FAILED'
    REFUNDED = 'REFUNDED'
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED'


class Order(db.Model):
    __tablename__ = 'orders'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    order_number = db.Column(db.String(30), unique=True, nullable=False, index=True)

    # Status
    status = db.Column(
        db.Enum(
            OrderStatus,
            values_callable=lambda enum_cls: [e.value for e in enum_cls]
        ),
        default=OrderStatus.PENDING,
        nullable=False,
        index=True
    )

    payment_status = db.Column(
        db.Enum(
            PaymentStatus,
            values_callable=lambda enum_cls: [e.value for e in enum_cls]
        ),
        default=PaymentStatus.PENDING,
        nullable=False
    )

    # Financials
    subtotal = db.Column(db.Numeric(12, 2), nullable=False)
    discount_amount = db.Column(db.Numeric(12, 2), default=0.00, nullable=False)
    coupon_id = db.Column(db.Integer, db.ForeignKey('coupons.id'), nullable=True)
    shipping_cost = db.Column(db.Numeric(8, 2), default=0.00, nullable=False)
    gst_amount = db.Column(db.Numeric(10, 2), default=0.00, nullable=False)
    total_amount = db.Column(db.Numeric(12, 2), nullable=False)

    # Payment
    payment_method = db.Column(db.String(50), nullable=True)  # stripe, cod, upi

    # Address
    shipping_address = db.Column(db.JSON, nullable=False)

    # Extra
    notes = db.Column(db.Text, nullable=True)
    tracking_number = db.Column(db.String(100), nullable=True)
    estimated_delivery = db.Column(db.Date, nullable=True)
    delivered_at = db.Column(db.DateTime(timezone=True), nullable=True)

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user = db.relationship('User', back_populates='orders')
    items = db.relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')
    coupon = db.relationship('Coupon', backref='orders')
    payment = db.relationship('Payment', back_populates='order', uselist=False)

    def __repr__(self):
        return f'<Order {self.order_number}>'

    @classmethod
    def generate_order_number(cls) -> str:
        """Generate a unique order number like SS-2024-XXXXXX."""
        year = datetime.now(timezone.utc).strftime('%Y')
        suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        return f'SS-{year}-{suffix}'

    def can_cancel(self) -> bool:
        """Return True if the order can still be cancelled."""
        return self.status in [OrderStatus.PENDING, OrderStatus.CONFIRMED]

    def to_dict(self, include_items: bool = True) -> dict:
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'order_number': self.order_number,
            'status': self.status.value if self.status else None,
            'payment_status': self.payment_status.value if self.payment_status else None,
            'subtotal': float(self.subtotal),
            'discount_amount': float(self.discount_amount),
            'coupon_id': self.coupon_id,
            'shipping_cost': float(self.shipping_cost),
            'gst_amount': float(self.gst_amount),
            'total_amount': float(self.total_amount),
            'payment_method': self.payment_method,
            'shipping_address': self.shipping_address,
            'notes': self.notes,
            'tracking_number': self.tracking_number,
            'estimated_delivery': (
                self.estimated_delivery.isoformat() if self.estimated_delivery else None
            ),
            'delivered_at': self.delivered_at.isoformat() if self.delivered_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'can_cancel': self.can_cancel(),
        }
        if include_items:
            data['items'] = [item.to_dict() for item in self.items]
        return data


class OrderItem(db.Model):
    __tablename__ = 'order_items'

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=True)

    # Snapshot at time of order (product may be edited/deleted later)
    product_name = db.Column(db.String(255), nullable=False)
    product_sku = db.Column(db.String(100), nullable=True)
    thumbnail = db.Column(db.String(512), nullable=True)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(12, 2), nullable=False)
    total_price = db.Column(db.Numeric(12, 2), nullable=False)
    color = db.Column(db.String(60), nullable=True)
    size = db.Column(db.String(60), nullable=True)

    # Relationships
    order = db.relationship('Order', back_populates='items')
    product = db.relationship('Product', back_populates='order_items')

    def __repr__(self):
        return f'<OrderItem {self.product_name} x{self.quantity}>'

    def to_dict(self) -> dict:
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product_name': self.product_name,
            'product_sku': self.product_sku,
            'thumbnail': self.thumbnail,
            'quantity': self.quantity,
            'unit_price': float(self.unit_price),
            'total_price': float(self.total_price),
            'color': self.color,
            'size': self.size,
        }
