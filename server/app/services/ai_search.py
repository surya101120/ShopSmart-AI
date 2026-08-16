import re
from app.models.product import Product
from app.models.category import Category
from sqlalchemy import or_, and_, asc, desc

def parse_ai_search_query(query_str):
    """
    Parses natural language query such as 'Gaming Laptop under ₹60,000'
    or 'Nike shoes under 10000 rating above 4'.
    Returns filters dict.
    """
    query_str_lower = query_str.lower()
    filters = {
        "keywords": [],
        "max_price": None,
        "min_price": None,
        "min_rating": None,
        "brand": None,
        "category_slug": None
    }

    # Extract price constraints (e.g. under 60000, below 60,000, under ₹60,000, less than 5000)
    under_match = re.search(r'(?:under|below|less than|within|\<|<=)\s*₹?\s*([\d,]+)', query_str_lower)
    if under_match:
        price_val = float(under_match.group(1).replace(',', ''))
        filters["max_price"] = price_val

    above_price_match = re.search(r'(?:above|over|more than|\>|>=)\s*₹?\s*([\d,]+)', query_str_lower)
    if above_price_match:
        price_val = float(above_price_match.group(1).replace(',', ''))
        filters["min_price"] = price_val

    # Extract rating constraints (e.g. rating 4, rated 4.5+, 4 stars)
    rating_match = re.search(r'(?:rating|rated|\*|stars?)\s*(?:above|over|>=)?\s*([345](?:\.[0-9])?)', query_str_lower)
    if rating_match:
        filters["min_rating"] = float(rating_match.group(1))

    # Known brands
    brands = ['dell', 'hp', 'asus', 'apple', 'lenovo', 'samsung', 'nike', 'adidas', 'sony', 'boat', 'oneplus', 'xiaomi', 'fitbit', 'razer', 'dyson', 'instant pot']
    for b in brands:
        if b in query_str_lower:
            filters["brand"] = b.capitalize()
            break

    # Clean words to get remaining keywords
    clean_text = re.sub(r'(?:under|below|less than|above|over|more than|rating|rated|stars?|₹|\<|\>|<=|>=)\s*[\d,.]+', '', query_str_lower)
    words = [w.strip() for w in re.split(r'\s+', clean_text) if len(w.strip()) > 2 and w.strip() not in ['and', 'for', 'with', 'the', 'under', 'laptop', 'laptops', 'phone', 'shoes']]
    filters["keywords"] = words

    return filters

def execute_ai_search(query_str, page=1, per_page=12):
    filters = parse_ai_search_query(query_str)
    
    q = Product.query.filter(Product.is_active == True)

    if filters["max_price"] is not None:
        q = q.filter(Product.price <= filters["max_price"])
    
    if filters["min_price"] is not None:
        q = q.filter(Product.price >= filters["min_price"])

    if filters["min_rating"] is not None:
        q = q.filter(Product.avg_rating >= filters["min_rating"])

    if filters["brand"]:
        q = q.filter(Product.brand.ilike(f"%{filters['brand']}%"))

    # Natural search fallback on product name, description, tags, brand
    search_terms = re.findall(r'\w+', query_str)
    search_conditions = []
    for term in search_terms:
        if len(term) > 2 and term.lower() not in ['under', 'below', 'above', 'with', 'from', 'this', 'that']:
            search_conditions.append(or_(
                Product.name.ilike(f"%{term}%"),
                Product.description.ilike(f"%{term}%"),
                Product.brand.ilike(f"%{term}%"),
                Product.short_description.ilike(f"%{term}%")
            ))

    if search_conditions:
        q = q.filter(or_(*search_conditions))

    paginated = q.paginate(page=page, per_page=per_page, error_out=False)
    
    return {
        "items": [item.to_dict() for item in paginated.items],
        "total": paginated.total,
        "page": paginated.page,
        "pages": paginated.pages,
        "per_page": paginated.per_page,
        "parsed_filters": filters
    }
