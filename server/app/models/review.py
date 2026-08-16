"""
ShopSmart AI - Review Model
"""

from datetime import datetime, timezone
from app.extensions import db


class Review(db.Model):
    __tablename__ = 'reviews'

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=True)
    rating = db.Column(db.Integer, nullable=False)  # 1-5
    title = db.Column(db.String(255), nullable=True)
    body = db.Column(db.Text, nullable=True)
    images = db.Column(db.JSON, default=list, nullable=False)
    is_verified = db.Column(db.Boolean, default=False, nullable=False)  # verified purchase
    helpful_count = db.Column(db.Integer, default=0, nullable=False)
    is_approved = db.Column(db.Boolean, default=True, nullable=False, index=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
        index=True,
    )

    # Relationships
    product = db.relationship('Product', back_populates='reviews')
    user = db.relationship('User', back_populates='reviews')

    __table_args__ = (
        db.CheckConstraint('rating >= 1 AND rating <= 5', name='ck_review_rating'),
        db.UniqueConstraint('product_id', 'user_id', name='uq_review_per_user_product'),
    )

    def __repr__(self):
        return f'<Review product={self.product_id} user={self.user_id} rating={self.rating}>'

    def to_dict(self, include_user: bool = True) -> dict:
        data = {
            'id': self.id,
            'product_id': self.product_id,
            'user_id': self.user_id,
            'order_id': self.order_id,
            'rating': self.rating,
            'title': self.title,
            'body': self.body,
            'images': self.images or [],
            'is_verified': self.is_verified,
            'helpful_count': self.helpful_count,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None,
        }
        if include_user and self.user:
            data['user'] = {
                'id': self.user.id,
                'name': self.user.name,
                'avatar_url': self.user.avatar_url,
            }
        return data
