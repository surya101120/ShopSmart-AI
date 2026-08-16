from flask import Blueprint, request, jsonify
from app.models.product import Product
from app.models.category import Category
from app.services.ai_search import execute_ai_search
from app.services.recommendation import (
    get_frequently_bought_together, get_similar_products,
    get_trending_products, get_personalized_recommendations
)
from app.utils.helpers import paginate_query
from app.extensions import db

products_bp = Blueprint('products', __name__)

@products_bp.route('/products', methods=['GET'])
def get_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    category_slug = request.args.get('category')
    brand = request.args.get('brand')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    min_rating = request.args.get('min_rating', type=float)
    search = request.args.get('search')
    sort_by = request.args.get('sort', 'newest')

    q = Product.query.filter(Product.is_active == True)

    if category_slug:
        cat = Category.query.filter_by(slug=category_slug).first()
        if cat:
            sub_cat_ids = [c.id for c in Category.query.filter_by(parent_id=cat.id).all()]
            cat_ids = [cat.id] + sub_cat_ids
            q = q.filter(Product.category_id.in_(cat_ids))

    if brand:
        q = q.filter(Product.brand.ilike(f"%{brand}%"))

    if min_price is not None:
        q = q.filter(Product.price >= min_price)

    if max_price is not None:
        q = q.filter(Product.price <= max_price)

    if min_rating is not None:
        q = q.filter(Product.avg_rating >= min_rating)

    if search:
        q = q.filter(
            Product.name.ilike(f"%{search}%") |
            Product.description.ilike(f"%{search}%") |
            Product.brand.ilike(f"%{search}%")
        )

    # Sorting
    if sort_by == 'price_low_high':
        q = q.order_by(Product.price.asc())
    elif sort_by == 'price_high_low':
        q = q.order_by(Product.price.desc())
    elif sort_by == 'rating':
        q = q.order_by(Product.avg_rating.desc())
    elif sort_by == 'popular':
        q = q.order_by(Product.sold_count.desc())
    else:
        q = q.order_by(Product.created_at.desc())

    result = paginate_query(q, page=page, per_page=per_page)
    return jsonify({"success": True, "data": result}), 200

@products_bp.route('/products/featured', methods=['GET'])
def get_featured_products():
    products = Product.query.filter_by(is_active=True, is_featured=True).limit(8).all()
    return jsonify({"success": True, "data": [p.to_dict() for p in products]}), 200

@products_bp.route('/products/trending', methods=['GET'])
def get_trending():
    trending = get_trending_products(limit=8)
    return jsonify({"success": True, "data": trending}), 200

@products_bp.route('/products/flash-sale', methods=['GET'])
def get_flash_sale():
    products = Product.query.filter(
        Product.is_active == True,
        Product.discount_percent >= 15
    ).order_by(Product.discount_percent.desc()).limit(8).all()
    return jsonify({"success": True, "data": [p.to_dict() for p in products]}), 200

@products_bp.route('/products/search/ai', methods=['GET'])
def search_ai():
    query_str = request.args.get('q', '')
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)

    if not query_str.strip():
        return jsonify({"success": False, "message": "Search query is required"}), 400

    results = execute_ai_search(query_str, page=page, per_page=per_page)
    return jsonify({"success": True, "data": results}), 200

@products_bp.route('/products/<id_or_slug>', methods=['GET'])
def get_product(id_or_slug):
    if id_or_slug.isdigit():
        p = Product.query.get(id_or_slug)
    else:
        p = Product.query.filter_by(slug=id_or_slug).first()

    if not p:
        return jsonify({"success": False, "message": "Product not found"}), 404

    # Increment view count
    p.views_count = (p.views_count or 0) + 1
    db.session.commit()

    return jsonify({"success": True, "data": p.to_dict()}), 200

@products_bp.route('/products/<int:product_id>/recommendations', methods=['GET'])
def get_product_recommendations(product_id):
    frequently_bought = get_frequently_bought_together(product_id, limit=3)
    similar = get_similar_products(product_id, limit=6)
    return jsonify({
        "success": True,
        "data": {
            "frequently_bought_together": frequently_bought,
            "similar_products": similar
        }
    }), 200

@products_bp.route('/categories', methods=['GET'])
def get_categories():
    categories = Category.query.filter_by(is_active=True).order_by(Category.sort_order.asc()).all()
    return jsonify({"success": True, "data": [c.to_dict() for c in categories]}), 200
