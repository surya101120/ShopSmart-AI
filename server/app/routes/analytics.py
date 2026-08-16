from flask import Blueprint, jsonify
from app.utils.helpers import admin_required
from app.extensions import db
from sqlalchemy import text

analytics_bp = Blueprint('analytics', __name__)

@analytics_bp.route('/revenue', methods=['GET'])
@admin_required()
def get_monthly_revenue():
    """Calculates monthly revenue using SQL Group By & Date Formatting."""
    sql = text("""
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') AS month,
            DATE_FORMAT(created_at, '%b %Y') AS month_name,
            COALESCE(SUM(total_amount), 0) AS revenue,
            COUNT(id) AS total_orders
        FROM orders
        WHERE status NOT IN ('cancelled', 'refunded')
        GROUP BY DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b %Y')
        ORDER BY month ASC
        LIMIT 12;
    """)
    result = db.session.execute(sql).fetchall()
    data = [{"month": r[0], "month_name": r[1], "revenue": float(r[2]), "orders": int(r[3])} for r in result]
    return jsonify({"success": True, "data": data}), 200

@analytics_bp.route('/top-products', methods=['GET'])
@admin_required()
def get_top_products_analytics():
    """SQL Window function to rank top selling products."""
    sql = text("""
        WITH ProductSales AS (
            SELECT 
                p.id,
                p.name,
                p.brand,
                p.thumbnail,
                SUM(oi.quantity) AS units_sold,
                SUM(oi.total_price) AS total_revenue,
                DENSE_RANK() OVER (ORDER BY SUM(oi.total_price) DESC) as sales_rank
            FROM products p
            JOIN order_items oi ON p.id = oi.product_id
            JOIN orders o ON o.id = oi.order_id
            WHERE o.status NOT IN ('cancelled', 'refunded')
            GROUP BY p.id, p.name, p.brand, p.thumbnail
        )
        SELECT id, name, brand, thumbnail, units_sold, total_revenue, sales_rank
        FROM ProductSales
        WHERE sales_rank <= 10
        ORDER BY sales_rank ASC;
    """)
    try:
        result = db.session.execute(sql).fetchall()
        data = [{
            "id": r[0], "name": r[1], "brand": r[2], "thumbnail": r[3],
            "units_sold": int(r[4]), "total_revenue": float(r[5]), "rank": int(r[6])
        } for r in result]
    except Exception:
        # Fallback query if window functions not supported
        sql_fallback = text("""
            SELECT p.id, p.name, p.brand, p.thumbnail, SUM(oi.quantity), SUM(oi.total_price)
            FROM products p
            JOIN order_items oi ON p.id = oi.product_id
            JOIN orders o ON o.id = oi.order_id
            WHERE o.status NOT IN ('cancelled', 'refunded')
            GROUP BY p.id, p.name, p.brand, p.thumbnail
            ORDER BY SUM(oi.total_price) DESC
            LIMIT 10;
        """)
        result = db.session.execute(sql_fallback).fetchall()
        data = [{
            "id": r[0], "name": r[1], "brand": r[2], "thumbnail": r[3],
            "units_sold": int(r[4]), "total_revenue": float(r[5]), "rank": idx + 1
        } for idx, r in enumerate(result)]

    return jsonify({"success": True, "data": data}), 200

@analytics_bp.route('/customer-metrics', methods=['GET'])
@admin_required()
def get_customer_metrics():
    """SQL metrics for Customer Lifetime Value (CLV), Average Order Value (AOV), Repeat Customers."""
    sql = text("""
        SELECT 
            COUNT(DISTINCT user_id) AS total_customers,
            COALESCE(AVG(total_amount), 0) AS average_order_value,
            COALESCE(SUM(total_amount), 0) AS total_revenue
        FROM orders
        WHERE status NOT IN ('cancelled', 'refunded');
    """)
    r = db.session.execute(sql).fetchone()
    
    # Repeat customers (HAVING clause)
    repeat_sql = text("""
        SELECT COUNT(*) FROM (
            SELECT user_id FROM orders 
            WHERE status NOT IN ('cancelled', 'refunded')
            GROUP BY user_id HAVING COUNT(id) > 1
        ) AS repeat_users;
    """)
    repeat_count = db.session.execute(repeat_sql).scalar() or 0
    total_cust = r[0] or 1

    return jsonify({
        "success": True,
        "data": {
            "total_customers": total_cust,
            "average_order_value": round(float(r[1]), 2),
            "total_revenue": round(float(r[2]), 2),
            "repeat_customers": repeat_count,
            "repeat_customer_rate": round((repeat_count / total_cust) * 100, 2)
        }
    }), 200

@analytics_bp.route('/category-distribution', methods=['GET'])
@admin_required()
def get_category_distribution():
    sql = text("""
        SELECT c.name, COUNT(p.id) AS product_count, COALESCE(SUM(p.sold_count), 0) AS total_sold
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id
        GROUP BY c.id, c.name;
    """)
    result = db.session.execute(sql).fetchall()
    data = [{"category": r[0], "product_count": int(r[1]), "total_sold": int(r[2])} for r in result]
    return jsonify({"success": True, "data": data}), 200
