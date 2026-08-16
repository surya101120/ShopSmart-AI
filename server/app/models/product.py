"""
ShopSmart AI - Product Model
"""

from datetime import datetime, timezone
from app.extensions import db


class Product(db.Model):
    __tablename__ = 'products'

    id = db.Column(db.Integer, primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True, index=True)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(300), unique=True, nullable=False, index=True)
    description = db.Column(db.Text, nullable=True)
    short_description = db.Column(db.String(500), nullable=True)
    brand = db.Column(db.String(120), nullable=True, index=True)
    sku = db.Column(db.String(100), unique=True, nullable=True, index=True)

    # Pricing
    price = db.Column(db.Numeric(12, 2), nullable=False)
    original_price = db.Column(db.Numeric(12, 2), nullable=True)
    discount_percent = db.Column(db.Numeric(5, 2), default=0.00)
    cost_price = db.Column(db.Numeric(12, 2), nullable=True)

    # Inventory
    stock = db.Column(db.Integer, default=0, nullable=False)
    low_stock_alert = db.Column(db.Integer, default=10, nullable=False)
    weight = db.Column(db.Numeric(8, 3), nullable=True)  # kg

    # Media (stored as JSON arrays)
    images = db.Column(db.JSON, default=list, nullable=False)
    thumbnail = db.Column(db.String(512), nullable=True)

    # Metadata (JSON fields)
    tags = db.Column(db.JSON, default=list, nullable=False)
    specifications = db.Column(db.JSON, default=dict, nullable=False)
    colors = db.Column(db.JSON, default=list, nullable=False)
    sizes = db.Column(db.JSON, default=list, nullable=False)

    # Status flags
    is_active = db.Column(db.Boolean, default=True, nullable=False, index=True)
    is_featured = db.Column(db.Boolean, default=False, nullable=False, index=True)
    is_new_arrival = db.Column(db.Boolean, default=False, nullable=False)

    # Analytics counters
    views_count = db.Column(db.Integer, default=0, nullable=False)
    sold_count = db.Column(db.Integer, default=0, nullable=False)
    avg_rating = db.Column(db.Numeric(3, 2), default=0.00, nullable=False)
    review_count = db.Column(db.Integer, default=0, nullable=False)

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
    category = db.relationship('Category', back_populates='products')
    cart_items = db.relationship('Cart', back_populates='product', lazy='dynamic')
    wishlist_items = db.relationship('Wishlist', back_populates='product', lazy='dynamic')
    order_items = db.relationship('OrderItem', back_populates='product', lazy='dynamic')
    reviews = db.relationship('Review', back_populates='product', lazy='dynamic')

    def __repr__(self):
        return f'<Product {self.name}>'

    @property
    def effective_discount(self) -> float:
        """Calculate actual discount percent if original_price is set."""
        if self.original_price and float(self.original_price) > 0:
            diff = float(self.original_price) - float(self.price)
            return round((diff / float(self.original_price)) * 100, 2)
        return float(self.discount_percent or 0)

    @property
    def is_in_stock(self) -> bool:
        return self.stock > 0

    @property
    def is_low_stock(self) -> bool:
        return 0 < self.stock <= self.low_stock_alert

    def increment_views(self) -> None:
        self.views_count = (self.views_count or 0) + 1

    def to_dict(self) -> dict:
        """Full serialization including all fields."""
        return {
            'id': self.id,
            'category_id': self.category_id,
            'category': self.category.to_dict(include_product_count=False) if self.category else None,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'short_description': self.short_description,
            'brand': self.brand,
            'sku': self.sku,
            'price': float(self.price),
            'original_price': float(self.original_price) if self.original_price else None,
            'discount_percent': float(self.discount_percent or 0),
            'effective_discount': self.effective_discount,
            'cost_price': float(self.cost_price) if self.cost_price else None,
            'stock': self.stock,
            'low_stock_alert': self.low_stock_alert,
            'is_in_stock': self.is_in_stock,
            'is_low_stock': self.is_low_stock,
            'weight': float(self.weight) if self.weight else None,
            'images': self.images or [],
            'thumbnail': self.thumbnail,
            'tags': self.tags or [],
            'specifications': self.specifications or {},
            'colors': self.colors or [],
            'sizes': self.sizes or [],
            'is_active': self.is_active,
            'is_featured': self.is_featured,
            'is_new_arrival': self.is_new_arrival,
            'views_count': self.views_count,
            'sold_count': self.sold_count,
            'avg_rating': float(self.avg_rating or 0),
            'review_count': self.review_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }

    def to_list_dict(self) -> dict:
        """Lightweight serialization for list views (no heavy fields)."""
        return {
            'id': self.id,
            'category_id': self.category_id,
            'name': self.name,
            'slug': self.slug,
            'short_description': self.short_description,
            'brand': self.brand,
            'price': float(self.price),
            'original_price': float(self.original_price) if self.original_price else None,
            'discount_percent': float(self.discount_percent or 0),
            'effective_discount': self.effective_discount,
            'thumbnail': self.thumbnail,
            'images': (self.images or [])[:3],
            'colors': self.colors or [],
            'sizes': self.sizes or [],
            'is_in_stock': self.is_in_stock,
            'is_low_stock': self.is_low_stock,
            'is_featured': self.is_featured,
            'is_new_arrival': self.is_new_arrival,
            'avg_rating': float(self.avg_rating or 0),
            'review_count': self.review_count,
            'sold_count': self.sold_count,
        }
