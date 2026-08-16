"""
ShopSmart AI - Flask Extensions
Initialize extensions without binding to an app instance.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS

# SQLAlchemy ORM instance
db = SQLAlchemy()

# Database migration manager
migrate = Migrate()

# JWT authentication manager
jwt = JWTManager()

# Email sending service
mail = Mail()

# Cross-Origin Resource Sharing handler
cors = CORS()
