"""
ShopSmart AI - Cart Model
"""

from datetime import datetime, timezone
from app.extensions import db


class Cart(db.Model):
    __tablename__ = 'cart'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    color = db.Column(db.String(60), nullable=True)
    size = db.Column(db.String(60), nullable=True)
    added_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user = db.relationship('User', back_populates='cart_items')
    product = db.relationship('Product', back_populates='cart_items')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'product_id', 'color', 'size', name='uq_cart_item'),
    )

    def __repr__(self):
        return f'<Cart user={self.user_id} product={self.product_id} qty={self.quantity}>'

    def to_dict(self, include_product: bool = True) -> dict:
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'quantity': self.quantity,
            'color': self.color,
            'size': self.size,
            'added_at': self.added_at.isoformat() if self.added_at else None,
        }
        if include_product and self.product:
            p = self.product
            data['product'] = {
                'id': p.id,
                'name': p.name,
                'slug': p.slug,
                'brand': p.brand,
                'price': float(p.price),
                'original_price': float(p.original_price) if p.original_price else None,
                'discount_percent': float(p.discount_percent or 0),
                'thumbnail': p.thumbnail,
                'stock': p.stock,
                'is_in_stock': p.is_in_stock,
            }
            # Computed line total
            data['line_total'] = round(float(p.price) * self.quantity, 2)
        return data
