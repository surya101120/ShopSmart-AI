"""
ShopSmart AI - Wishlist Model
"""

from datetime import datetime, timezone
from app.extensions import db


class Wishlist(db.Model):
    __tablename__ = 'wishlist'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    added_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    user = db.relationship('User', back_populates='wishlist_items')
    product = db.relationship('Product', back_populates='wishlist_items')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'product_id', name='uq_wishlist_item'),
    )

    def __repr__(self):
        return f'<Wishlist user={self.user_id} product={self.product_id}>'

    def to_dict(self, include_product: bool = True) -> dict:
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'product_id': self.product_id,
            'added_at': self.added_at.isoformat() if self.added_at else None,
        }
        if include_product and self.product:
            data['product'] = self.product.to_list_dict()
        return data
