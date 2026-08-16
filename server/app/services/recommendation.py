from app.models.product import Product
from app.models.order import Order, OrderItem
from app.models.cart import Cart
from app.models.wishlist import Wishlist
from app.extensions import db
from sqlalchemy import func

def get_frequently_bought_together(product_id, limit=3):
    """
    Finds products ordered together in the same order.
    If no co-orders exist, falls back to items in the same category or complementary products.
    """
    target_product = Product.query.get(product_id)
    if not target_product:
        return []

    # Find orders containing target_product
    order_ids = db.session.query(OrderItem.order_id).filter(OrderItem.product_id == product_id).subquery()

    # Find other products in those orders
    co_bought = db.session.query(
        OrderItem.product_id,
        func.count(OrderItem.product_id).label('count')
    ).filter(
        OrderItem.order_id.in_(order_ids),
        OrderItem.product_id != product_id
    ).group_by(OrderItem.product_id).order_by(func.count(OrderItem.product_id).desc()).limit(limit).all()

    co_product_ids = [item.product_id for item in co_bought]

    if len(co_product_ids) < limit:
        # Fallback to products in same or complementary category
        needed = limit - len(co_product_ids)
        fallback_products = Product.query.filter(
            Product.category_id == target_product.category_id,
            Product.id != product_id,
            ~Product.id.in_(co_product_ids) if co_product_ids else True
        ).limit(needed).all()
        
        results = Product.query.filter(Product.id.in_(co_product_ids)).all() if co_product_ids else []
        results.extend(fallback_products)
        return [p.to_dict() for p in results[:limit]]

    results = Product.query.filter(Product.id.in_(co_product_ids)).all()
    return [p.to_dict() for p in results]

def get_similar_products(product_id, limit=6):
    """Find products in the same category or brand."""
    target_product = Product.query.get(product_id)
    if not target_product:
        return []

    similar = Product.query.filter(
        Product.id != product_id,
        Product.is_active == True,
        (Product.category_id == target_product.category_id) | (Product.brand == target_product.brand)
    ).order_by(Product.avg_rating.desc(), Product.sold_count.desc()).limit(limit).all()

    return [p.to_dict() for p in similar]

def get_trending_products(limit=8):
    """Get top products by view count and sold count."""
    trending = Product.query.filter(Product.is_active == True).order_by(
        Product.sold_count.desc(),
        Product.views_count.desc(),
        Product.avg_rating.desc()
    ).limit(limit).all()
    return [p.to_dict() for p in trending]

def get_personalized_recommendations(user_id=None, limit=8):
    """Personalized recommendations based on user history, wishlist, or top rated."""
    if not user_id:
        return get_trending_products(limit)

    # Get user's cart and wishlist category IDs
    cart_cats = db.session.query(Product.category_id).join(Cart, Cart.product_id == Product.id).filter(Cart.user_id == user_id).all()
    wish_cats = db.session.query(Product.category_id).join(Wishlist, Wishlist.product_id == Product.id).filter(Wishlist.user_id == user_id).all()
    
    cat_ids = set([c[0] for c in cart_cats + wish_cats])

    if cat_ids:
        recs = Product.query.filter(
            Product.category_id.in_(cat_ids),
            Product.is_active == True
        ).order_by(Product.avg_rating.desc()).limit(limit).all()
        if len(recs) >= 4:
            return [p.to_dict() for p in recs]

    return get_trending_products(limit)
