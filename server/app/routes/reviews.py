from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.review import Review
from app.models.product import Product
from app.models.order import Order, OrderItem
from app.utils.helpers import paginate_query
from app.extensions import db

reviews_bp = Blueprint('reviews', __name__)

@reviews_bp.route('/reviews/product/<int:product_id>', methods=['GET'])
def get_product_reviews(product_id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    q = Review.query.filter_by(product_id=product_id, is_approved=True).order_by(Review.created_at.desc())
    result = paginate_query(q, page=page, per_page=per_page)
    return jsonify({"success": True, "data": result}), 200

@reviews_bp.route('/reviews', methods=['POST'])
@jwt_required()
def create_review():
    user_id = get_jwt_identity()
    data = request.get_json() or {}
    product_id = data.get('product_id')
    rating = data.get('rating')
    title = data.get('title')
    body = data.get('body')
    images = data.get('images', [])

    if not product_id or not rating or not (1 <= rating <= 5):
        return jsonify({"success": False, "message": "Valid product ID and rating (1-5) required"}), 400

    # Check if user bought product
    has_purchased = db.session.query(OrderItem).join(Order, Order.id == OrderItem.order_id).filter(
        Order.user_id == user_id,
        OrderItem.product_id == product_id,
        Order.status == 'delivered'
    ).first() is not None

    existing = Review.query.filter_by(user_id=user_id, product_id=product_id).first()
    if existing:
        existing.rating = rating
        existing.title = title
        existing.body = body
        existing.images = images
        existing.is_verified = has_purchased
    else:
        review = Review(
            product_id=product_id,
            user_id=user_id,
            rating=rating,
            title=title,
            body=body,
            images=images,
            is_verified=has_purchased
        )
        db.session.add(review)

    db.session.commit()

    # Recalculate product rating
    product = Product.query.get(product_id)
    if product:
        all_reviews = Review.query.filter_by(product_id=product_id, is_approved=True).all()
        if all_reviews:
            product.avg_rating = round(sum(r.rating for r in all_reviews) / len(all_reviews), 2)
            product.review_count = len(all_reviews)
            db.session.commit()

    return jsonify({"success": True, "message": "Review submitted successfully"}), 201
