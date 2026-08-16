h
# ShopSmart AI – REST API Documentation

Base URL: `http://localhost:5000/api`

## Authentication Endpoints
- `POST /auth/register` – Create user account
- `POST /auth/login` – Login & receive JWT tokens
- `GET /auth/me` – Fetch current user profile (JWT required)
- `PUT /auth/me` – Update user profile (JWT required)

## Product Endpoints
- `GET /products` – Fetch products with pagination & filters (`category`, `brand`, `min_price`, `max_price`, `sort`)
- `GET /products/featured` – Get featured products
- `GET /products/trending` – Get trending products
- `GET /products/flash-sale` – Get flash sale products (>15% off)
- `GET /products/search/ai` – AI natural language search (`q=Gaming Laptop under ₹60,000`)
- `GET /products/:id_or_slug` – Product detail
- `GET /products/:id/recommendations` – Frequently bought together & similar products

## Shopping Cart & Wishlist
- `GET /cart` – Fetch current user cart with subtotal, GST (18%), and shipping
- `POST /cart` – Add product to cart
- `PUT /cart/:item_id` – Update cart quantity
- `DELETE /cart/:item_id` – Remove cart item
- `GET /wishlist` – Fetch user wishlist items
- `POST /wishlist` – Save product to wishlist

## Orders & Payments
- `POST /orders` – Place order (cod or stripe)
- `GET /orders` – Fetch order history
- `GET /orders/:id` – Fetch order details
- `GET /orders/track/:order_number` – Live order tracking
- `POST /payments/create-intent` – Stripe PaymentIntent creation
- `POST /payments/confirm` – Confirm Stripe payment

## Admin & Analytics (Admin JWT Required)
- `GET /admin/dashboard` – Store KPIs, revenue, low stock alerts
- `GET /admin/products` – Admin product management
- `POST /admin/products` – Create new product
- `DELETE /admin/products/:id` – Delete product
- `GET /analytics/revenue` – Monthly revenue SQL reporting
- `GET /analytics/top-products` – SQL Window Function rank report
- `GET /analytics/customer-metrics` – AOV, CLV, repeat customer metrics
- `GET /invoice/:order_id` – Download PDF invoice
