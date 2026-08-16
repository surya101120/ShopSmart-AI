import os
from flask import Blueprint, request, jsonify
from app.models.product import Product
from app.services.ai_search import execute_ai_search

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/chatbot/message', methods=['POST'])
def handle_chat_message():
    data = request.get_json() or {}
    message = data.get('message', '').strip()
    history = data.get('history', [])

    if not message:
        return jsonify({"success": False, "message": "Message is required"}), 400

    msg_lower = message.lower()
    recommended_products = []

    # Rule-based fallback + Gemini check
    gemini_key = os.getenv('GEMINI_API_KEY')
    if gemini_key and not gemini_key.startswith('your_'):
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-pro')
            system_prompt = "You are ShopSmart AI assistant, an expert e-commerce product advisor for laptops, phones, shoes, and appliances. Be helpful, concise, and recommend products."
            response = model.generate_content(f"{system_prompt}\nUser: {message}\nAssistant:")
            reply_text = response.text
        except Exception as e:
            reply_text = get_smart_reply(msg_lower)
    else:
        reply_text = get_smart_reply(msg_lower)

    # Attach relevant product recommendations using AI search filters
    product_keywords = [
        'laptop', 'coding', 'gaming', 'dell', 'macbook', 'asus', 'hp',
        'phone', 'mobile', 'samsung', 'iphone', 'oneplus', 'camera',
        'shoe', 'nike', 'running', 'adidas', 'footwear',
        'headphone', 'headphones', 'earbuds', 'watch', 'tablet'
    ]

    price_keywords = [ 
        'under', 'below', 'less than', 'within',
        'above', 'over', 'more than'
    ]

    is_product_query = (
        any(k in msg_lower for k in product_keywords)
        or any(k in msg_lower for k in price_keywords)
    )

    if is_product_query:
        try:
            search_result = execute_ai_search(
                message,
                page=1,
                per_page=3
            )
            recommended_products = search_result.get("items", [])
        except Exception as e:
            print("AI product search error:", e)
            recommended_products = []

    return jsonify({
        "success": True,
        "reply": reply_text,
        "recommended_products": recommended_products
    }), 200

def get_smart_reply(msg):
    if 'coding' in msg and 'laptop' in msg:
        return "For coding, I recommend laptops with at least 16GB RAM and a fast multi-core processor like the Dell Inspiron 15 (i7/16GB) or MacBook Air M2. They provide smooth compilation and multi-tasking."
    elif 'gaming' in msg:
        return "For gaming, check out the Dell Inspiron 15 Gaming Laptop with RTX 3050 graphics or the Sony PlayStation 5 console for immersive 4K gaming!"
    elif 'shoe' in msg or 'nike' in msg:
        return "Nike Air Max 270 and Adidas Ultraboost 22 are customer favorites for maximum comfort and running performance. Would you like to check available sizes?"
    elif 'order' in msg or 'track' in msg:
        return "You can track your order status live under 'Orders' in your profile or using our order tracking tool with your Order Number!"
    elif 'discount' in msg or 'coupon' in msg:
        return "Use coupon code WELCOME20 to get 20% off on your order, or FESTIVE50 for flat ₹50 off!"
    else:
        return f"I'm here to help! You can ask me for product recommendations (e.g. 'Which laptop is best for coding?'), deals, or order tracking."
