import re
from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt, verify_jwt_in_request
from app.models.user import User

def admin_required():
    """Decorator to enforce admin role requirement on routes."""
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            role = claims.get("role", "user")
            if role not in ["admin", "super_admin"]:
                return jsonify({
                    "success": False,
                    "message": "Admin privileges required"
                }), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator

def slugify(text):
    """Convert text to URL-friendly slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

def paginate_query(query, page=1, per_page=12):
    """Paginate a SQLAlchemy query and return standard structure."""
    paginated = query.paginate(page=page, per_page=per_page, error_out=False)
    return {
        "items": [item.to_dict() for item in paginated.items],
        "total": paginated.total,
        "page": paginated.page,
        "pages": paginated.pages,
        "per_page": paginated.per_page,
        "has_next": paginated.has_next,
        "has_prev": paginated.has_prev
    }

def success_response(data=None, message="Success", status_code=200):
    res = {"success": True, "message": message}
    if data is not None:
        res["data"] = data
    return jsonify(res), status_code

def error_response(message="An error occurred", status_code=400, errors=None):
    res = {"success": False, "message": message}
    if errors is not None:
        res["errors"] = errors
    return jsonify(res), status_code
