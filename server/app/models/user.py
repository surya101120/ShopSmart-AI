"""
ShopSmart AI - User Model
"""

import secrets
from datetime import datetime, timezone, timedelta
from app.extensions import db
import bcrypt


class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    avatar_url = db.Column(db.String(512), nullable=True)
    is_email_verified = db.Column(db.Boolean, default=False, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    role = db.Column(db.String(20), default='user', nullable=False)
    email_verify_token = db.Column(db.String(255), nullable=True, unique=True)
    reset_token = db.Column(db.String(255), nullable=True, unique=True)
    reset_token_expires = db.Column(db.DateTime(timezone=True), nullable=True)
    last_login = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    # Relationships
    cart_items = db.relationship('Cart', back_populates='user', cascade='all, delete-orphan', lazy='dynamic')
    wishlist_items = db.relationship('Wishlist', back_populates='user', cascade='all, delete-orphan', lazy='dynamic')
    orders = db.relationship('Order', back_populates='user', lazy='dynamic')
    reviews = db.relationship('Review', back_populates='user', lazy='dynamic')
    notifications = db.relationship('Notification', back_populates='user', cascade='all, delete-orphan', lazy='dynamic')

    def __repr__(self):
        return f'<User {self.email}>'

    # ------------------------------------------------------------------ #
    # Password management
    # ------------------------------------------------------------------ #

    def set_password(self, password: str) -> None:
        """Hash and store the user password using bcrypt."""
        salt = bcrypt.gensalt(rounds=12)
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

    def check_password(self, password: str) -> bool:
        """Verify a plain-text password against the stored hash."""
        try:
            return bcrypt.checkpw(
                password.encode('utf-8'),
                self.password_hash.encode('utf-8'),
            )
        except Exception:
            return False

    # ------------------------------------------------------------------ #
    # Token generation
    # ------------------------------------------------------------------ #

    def generate_verify_token(self) -> str:
        """Generate a secure email verification token and store it."""
        token = secrets.token_urlsafe(48)
        self.email_verify_token = token
        return token

    def generate_reset_token(self, expires_in_hours: int = 1) -> str:
        """Generate a password-reset token valid for `expires_in_hours` hours."""
        token = secrets.token_urlsafe(48)
        self.reset_token = token
        self.reset_token_expires = datetime.now(timezone.utc) + timedelta(hours=expires_in_hours)
        return token

    def is_reset_token_valid(self, token: str) -> bool:
        """Return True if the reset token matches and has not expired."""
        if self.reset_token != token:
            return False
        if self.reset_token_expires is None:
            return False
        expires = self.reset_token_expires
        if expires.tzinfo is None:
            expires = expires.replace(tzinfo=timezone.utc)
        return datetime.now(timezone.utc) < expires

    # ------------------------------------------------------------------ #
    # Serialization
    # ------------------------------------------------------------------ #

    def to_dict(self, include_sensitive: bool = False) -> dict:
        """Serialize the user to a dictionary."""
        data = {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'avatar_url': self.avatar_url,
            'role': self.role,
            'is_email_verified': self.is_email_verified,
            'is_active': self.is_active,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
        }
        if include_sensitive:
            data['email_verify_token'] = self.email_verify_token
            data['reset_token'] = self.reset_token
        return data
