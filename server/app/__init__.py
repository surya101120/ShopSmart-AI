"""
ShopSmart AI - Flask Application Factory
"""

from flask import Flask, jsonify
from flask_cors import CORS
from config import get_config
from app.extensions import db, migrate, jwt, mail


def create_app(config_class=None):
    """Create and configure the Flask application."""

    app = Flask(__name__)

    # Load configuration
    if config_class is None:
        config_class = get_config()
    app.config.from_object(config_class)

    # ------------------------------------------------------------------ #
    # Initialize extensions
    # ------------------------------------------------------------------ #
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)

    # CORS - allow the React frontend origin
    CORS(app, resources={
        r"/api/*": {
            "origins": [
                 app.config.get("FRONTEND_URL", "http://localhost:5173"),
                "http://localhost:3000",
                "http://127.0.0.1:5173",
                "http://localhost:5172",
                "http://127.0.0.1:5172",
                "http://localhost:5174",
                "http://127.0.0.1:5174",
                "http://localhost:5177",
                "http://127.0.0.1:5177",
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "supports_credentials": True
              }
        })

    # ------------------------------------------------------------------ #
    # JWT error handlers
    # ------------------------------------------------------------------ #
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'message': 'Token has expired. Please login again.',
            'error': 'token_expired',
        }), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Invalid token. Please login again.',
            'error': 'token_invalid',
        }), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'success': False,
            'message': 'Authorization token is required.',
            'error': 'authorization_required',
        }), 401

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'message': 'Token has been revoked. Please login again.',
            'error': 'token_revoked',
        }), 401

    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'message': 'Fresh token required.',
            'error': 'fresh_token_required',
        }), 401

    # ------------------------------------------------------------------ #
    # In-memory token blocklist (use Redis in production)
    # ------------------------------------------------------------------ #
    token_blocklist = set()

    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        jti = jwt_payload.get('jti')
        return jti in token_blocklist

    # Store blocklist on app so routes can access it
    app.token_blocklist = token_blocklist

    # ------------------------------------------------------------------ #
    # Register blueprints
    # ------------------------------------------------------------------ #
    from app.routes.auth import auth_bp
    from app.routes.products import products_bp
    from app.routes.cart import cart_bp
    from app.routes.wishlist import wishlist_bp
    from app.routes.orders import orders_bp
    from app.routes.payments import payments_bp
    from app.routes.reviews import reviews_bp
    from app.routes.coupons import coupons_bp
    from app.routes.admin import admin_bp
    from app.routes.chatbot import chatbot_bp
    from app.routes.invoice import invoice_bp
    from app.routes.analytics import analytics_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api')
    app.register_blueprint(cart_bp, url_prefix='/api')
    app.register_blueprint(wishlist_bp, url_prefix='/api')
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(payments_bp, url_prefix='/api')
    app.register_blueprint(reviews_bp, url_prefix='/api')
    app.register_blueprint(coupons_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(chatbot_bp, url_prefix='/api')
    app.register_blueprint(invoice_bp, url_prefix='/api')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')

    # ------------------------------------------------------------------ #
    # Global error handlers
    # ------------------------------------------------------------------ #
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Resource not found.',
            'error': 'not_found',
        }), 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return jsonify({
            'success': False,
            'message': 'Method not allowed.',
            'error': 'method_not_allowed',
        }), 405

    @app.errorhandler(500)
    def internal_server_error(error):
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'An internal server error occurred.',
            'error': 'internal_server_error',
        }), 500

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            'success': False,
            'message': 'Bad request.',
            'error': 'bad_request',
        }), 400

    # ------------------------------------------------------------------ #
    # Health check endpoint
    # ------------------------------------------------------------------ #
    @app.route('/api/health', methods=['GET'])
    def health_check():
        try:
            db.session.execute(db.text('SELECT 1'))
            db_status = 'healthy'
        except Exception:
            db_status = 'unhealthy'

        return jsonify({
            'success': True,
            'message': 'ShopSmart AI API is running',
            'status': 'healthy',
            'database': db_status,
            'version': '1.0.0',
        }), 200

    return app
