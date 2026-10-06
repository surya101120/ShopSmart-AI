-- ============================================================
-- ShopSmart AI - Database Schema
-- MySQL 8.0+ | 3NF Normalized | Production-Ready
-- ============================================================

-- ============================================================
-- TABLE: admins
-- ============================================================
CREATE TABLE IF NOT EXISTS admins (
    id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('super_admin', 'admin', 'manager') DEFAULT 'admin',
    is_active     BOOLEAN DEFAULT TRUE,
    last_login    DATETIME,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_admins_email (email)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name              VARCHAR(100) NOT NULL,
    email             VARCHAR(150) NOT NULL UNIQUE,
    password_hash     VARCHAR(255) NOT NULL,
    phone             VARCHAR(20),
    avatar_url        VARCHAR(500),
    role              VARCHAR(20) NOT NULL DEFAULT 'user',
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active         BOOLEAN DEFAULT TRUE,
    email_verify_token VARCHAR(255),
    reset_token       VARCHAR(255),
    reset_token_expires DATETIME,
    last_login        DATETIME,
    created_at        DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_reset_token (reset_token)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: refresh_tokens
-- ============================================================
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token      VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_refresh_token (token)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: addresses
-- ============================================================
CREATE TABLE IF NOT EXISTS addresses (
    id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id      INT  NOT NULL,
    name         VARCHAR(100) NOT NULL,
    phone        VARCHAR(20) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city         VARCHAR(100) NOT NULL,
    state        VARCHAR(100) NOT NULL,
    pincode      VARCHAR(10) NOT NULL,
    country      VARCHAR(100) DEFAULT 'India',
    is_default   BOOLEAN DEFAULT FALSE,
    created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_addresses_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    slug        VARCHAR(120) NOT NULL UNIQUE,
    description TEXT,
    image_url   VARCHAR(500),
    parent_id   INT UNSIGNED,
    is_active   BOOLEAN DEFAULT TRUE,
    sort_order  INT DEFAULT 0,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_parent (parent_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: products
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id      INT UNSIGNED NOT NULL,
    name             VARCHAR(255) NOT NULL,
    slug             VARCHAR(280) NOT NULL UNIQUE,
    description      TEXT,
    short_description VARCHAR(500),
    brand            VARCHAR(100),
    sku              VARCHAR(100) UNIQUE,
    price            DECIMAL(10,2) NOT NULL,
    original_price   DECIMAL(10,2),
    discount_percent DECIMAL(5,2) DEFAULT 0,
    cost_price       DECIMAL(10,2),
    stock            INT UNSIGNED DEFAULT 0,
    low_stock_alert  INT UNSIGNED DEFAULT 10,
    weight           DECIMAL(8,3),
    images           JSON COMMENT 'Array of image URLs',
    thumbnail        VARCHAR(500),
    tags             JSON COMMENT 'Array of tag strings',
    specifications   JSON COMMENT 'Key-value specs like RAM, Storage',
    colors           JSON COMMENT 'Available colors',
    sizes            JSON COMMENT 'Available sizes',
    is_active        BOOLEAN DEFAULT TRUE,
    is_featured      BOOLEAN DEFAULT FALSE,
    is_new_arrival   BOOLEAN DEFAULT FALSE,
    views_count      INT UNSIGNED DEFAULT 0,
    sold_count       INT UNSIGNED DEFAULT 0,
    avg_rating       DECIMAL(3,2) DEFAULT 0,
    review_count     INT UNSIGNED DEFAULT 0,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FULLTEXT INDEX ft_products_search (name, description, brand),
    INDEX idx_products_category (category_id),
    INDEX idx_products_price (price),
    INDEX idx_products_brand (brand),
    INDEX idx_products_rating (avg_rating),
    INDEX idx_products_active (is_active),
    INDEX idx_products_featured (is_featured),
    INDEX idx_products_sold (sold_count)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: inventory
-- ============================================================
CREATE TABLE IF NOT EXISTS inventory (
    id             INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id     INT NOT NULL UNIQUE,
    quantity       INT UNSIGNED DEFAULT 0,
    reserved       INT UNSIGNED DEFAULT 0,
    low_stock_threshold INT UNSIGNED DEFAULT 10,
    last_restocked DATETIME,
    updated_at     DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: cart
-- ============================================================
CREATE TABLE IF NOT EXISTS cart (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    product_id INT  NOT NULL,
    quantity   INT UNSIGNED DEFAULT 1,
    color      VARCHAR(50),
    size       VARCHAR(50),
    added_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uq_cart_item (user_id, product_id, color, size),
    INDEX idx_cart_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: wishlist
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    product_id INT NOT NULL,
    added_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY uq_wishlist_item (user_id, product_id),
    INDEX idx_wishlist_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: coupons
-- ============================================================
CREATE TABLE IF NOT EXISTS coupons (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code             VARCHAR(50) NOT NULL UNIQUE,
    description      VARCHAR(255),
    discount_type    ENUM('percentage', 'flat') NOT NULL,
    discount_value   DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_discount     DECIMAL(10,2),
    usage_limit      INT UNSIGNED,
    used_count       INT UNSIGNED DEFAULT 0,
    is_active        BOOLEAN DEFAULT TRUE,
    starts_at        DATETIME,
    expires_at       DATETIME,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_coupons_code (code),
    INDEX idx_coupons_active (is_active, expires_at)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: orders
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id          INT NOT NULL,
    order_number     VARCHAR(50) NOT NULL UNIQUE,
    status           ENUM('pending','confirmed','packed','shipped','out_for_delivery','delivered','cancelled','refunded') DEFAULT 'pending',
    subtotal         DECIMAL(10,2) NOT NULL,
    discount_amount  DECIMAL(10,2) DEFAULT 0,
    coupon_id        INT UNSIGNED,
    shipping_cost    DECIMAL(10,2) DEFAULT 0,
    gst_amount       DECIMAL(10,2) DEFAULT 0,
    total_amount     DECIMAL(10,2) NOT NULL,
    payment_method   ENUM('stripe','cod','upi') DEFAULT 'stripe',
    payment_status   ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
    shipping_address JSON NOT NULL,
    notes            TEXT,
    tracking_number  VARCHAR(100),
    estimated_delivery DATE,
    delivered_at     DATETIME,
    created_at       DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL,
    INDEX idx_orders_user (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_date (created_at),
    INDEX idx_orders_number (order_number)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: order_items
-- ============================================================
CREATE TABLE IF NOT EXISTS order_items (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id    INT UNSIGNED NOT NULL,
    product_id  INT  NOT NULL,
    product_name VARCHAR(255) NOT NULL COMMENT 'Snapshot at time of order',
    product_sku VARCHAR(100),
    thumbnail   VARCHAR(500),
    quantity    INT UNSIGNED NOT NULL,
    unit_price  DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    color       VARCHAR(50),
    size        VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id),
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_product (product_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: payments
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id           INT UNSIGNED NOT NULL UNIQUE,
    stripe_payment_id  VARCHAR(255),
    stripe_client_secret VARCHAR(500),
    amount             DECIMAL(10,2) NOT NULL,
    currency           VARCHAR(10) DEFAULT 'inr',
    status             ENUM('pending','succeeded','failed','refunded') DEFAULT 'pending',
    method             VARCHAR(50),
    metadata           JSON,
    paid_at            DATETIME,
    created_at         DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_payments_stripe_id (stripe_payment_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL, 
    user_id    INT NOT NULL,
    order_id   INT UNSIGNED,
    rating     TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title      VARCHAR(200),
    body       TEXT,
    images     JSON COMMENT 'Array of image URLs',
    is_verified BOOLEAN DEFAULT FALSE COMMENT 'Verified purchase',
    helpful_count INT UNSIGNED DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    UNIQUE KEY uq_user_product_review (user_id, product_id),
    INDEX idx_reviews_product (product_id),
    INDEX idx_reviews_user (user_id)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    INT NOT NULL,
    type       ENUM('order_placed','order_shipped','order_delivered','payment_success','review_approved','promo','system') NOT NULL,
    title      VARCHAR(255) NOT NULL,
    message    TEXT NOT NULL,
    data       JSON,
    is_read    BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user (user_id, is_read),
    INDEX idx_notifications_created (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- TABLE: product_views (for recommendation & analytics)
-- ============================================================
CREATE TABLE IF NOT EXISTS product_views (
    id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id    INT,
    product_id INT NOT NULL,
    session_id VARCHAR(100),
    viewed_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_views_user (user_id),
    INDEX idx_product_views_product (product_id),
    INDEX idx_product_views_date (viewed_at)
) ENGINE=InnoDB;

-- ============================================================
-- TRIGGERS
-- ============================================================

DELIMITER $$

-- Update avg_rating and review_count after new review
CREATE TRIGGER trg_update_product_rating_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE products
    SET avg_rating   = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE),
        review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE)
    WHERE id = NEW.product_id;
END$$

-- Update avg_rating after review update
CREATE TRIGGER trg_update_product_rating_update
AFTER UPDATE ON reviews
FOR EACH ROW
BEGIN
    UPDATE products
    SET avg_rating   = (SELECT AVG(rating) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE),
        review_count = (SELECT COUNT(*) FROM reviews WHERE product_id = NEW.product_id AND is_approved = TRUE)
    WHERE id = NEW.product_id;
END$$

-- Decrement stock when order item is created
CREATE TRIGGER trg_decrement_stock
AFTER INSERT ON order_items
FOR EACH ROW
BEGIN
    UPDATE products SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
    UPDATE inventory SET quantity = quantity - NEW.quantity WHERE product_id = NEW.product_id;
END$$

-- Increment sold_count when order is delivered
CREATE TRIGGER trg_increment_sold_count
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        UPDATE products p
        JOIN order_items oi ON oi.order_id = NEW.id AND oi.product_id = p.id
        SET p.sold_count = p.sold_count + oi.quantity;
    END IF;
END$$

-- Restore stock on order cancellation
CREATE TRIGGER trg_restore_stock_on_cancel
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status NOT IN ('cancelled','delivered') THEN
        UPDATE products p
        JOIN order_items oi ON oi.order_id = NEW.id AND oi.product_id = p.id
        SET p.stock = p.stock + oi.quantity;
        UPDATE inventory inv
        JOIN order_items oi ON oi.order_id = NEW.id AND oi.product_id = inv.product_id
        SET inv.quantity = inv.quantity + oi.quantity;
    END IF;
END$$

DELIMITER ;

-- ============================================================
-- STORED PROCEDURES
-- ============================================================

DELIMITER $$

-- Get dashboard KPIs
CREATE PROCEDURE sp_get_dashboard_kpis()
BEGIN
    SELECT
        (SELECT COUNT(*) FROM orders WHERE status NOT IN ('cancelled','refunded')) AS total_orders,
        (SELECT COALESCE(SUM(total_amount),0) FROM orders WHERE payment_status = 'paid') AS total_revenue,
        (SELECT COUNT(*) FROM users WHERE is_active = TRUE) AS total_users,
        (SELECT COUNT(*) FROM products WHERE is_active = TRUE) AS total_products,
        (SELECT COALESCE(SUM(total_amount),0) FROM orders WHERE payment_status = 'paid' AND DATE(created_at) = CURDATE()) AS today_revenue,
        (SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURDATE()) AS today_orders;
END$$

-- Get monthly revenue for charts (last 12 months)
CREATE PROCEDURE sp_get_monthly_revenue()
BEGIN
    SELECT
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        DATE_FORMAT(created_at, '%b %Y') AS month_label,
        COALESCE(SUM(total_amount), 0) AS revenue,
        COUNT(*) AS order_count
    FROM orders
    WHERE payment_status = 'paid'
      AND created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
    ORDER BY month ASC;
END$$

-- Get top selling products
CREATE PROCEDURE sp_get_top_products(IN p_limit INT)
BEGIN
    SELECT
        p.id, p.name, p.thumbnail, p.price, p.sold_count,
        p.avg_rating, p.review_count,
        COALESCE(SUM(oi.total_price), 0) AS total_revenue
    FROM products p
    JOIN order_items oi ON oi.product_id = p.id
    JOIN orders o ON o.id = oi.order_id AND o.payment_status = 'paid'
    GROUP BY p.id
    ORDER BY total_revenue DESC
    LIMIT p_limit;
END$$

-- Customer Lifetime Value
CREATE PROCEDURE sp_customer_lifetime_value()
BEGIN
    SELECT
        u.id, u.name, u.email, u.created_at AS member_since,
        COUNT(DISTINCT o.id) AS total_orders,
        COALESCE(SUM(o.total_amount), 0) AS lifetime_value,
        COALESCE(AVG(o.total_amount), 0) AS avg_order_value,
        MAX(o.created_at) AS last_order_date
    FROM users u
    LEFT JOIN orders o ON o.user_id = u.id AND o.payment_status = 'paid'
    GROUP BY u.id
    ORDER BY lifetime_value DESC
    LIMIT 50;
END$$

-- Sales analytics with window functions
CREATE PROCEDURE sp_sales_analytics()
BEGIN
    WITH monthly_sales AS (
        SELECT
            DATE_FORMAT(created_at, '%Y-%m') AS month,
            SUM(total_amount) AS revenue,
            COUNT(*) AS orders,
            COUNT(DISTINCT user_id) AS unique_customers
        FROM orders
        WHERE payment_status = 'paid'
        GROUP BY month
    ),
    ranked AS (
        SELECT *,
            LAG(revenue) OVER (ORDER BY month) AS prev_revenue,
            SUM(revenue) OVER (ORDER BY month ROWS UNBOUNDED PRECEDING) AS cumulative_revenue
        FROM monthly_sales
    )
    SELECT *,
        ROUND(((revenue - COALESCE(prev_revenue, revenue)) / COALESCE(prev_revenue, revenue)) * 100, 2) AS growth_pct
    FROM ranked
    ORDER BY month;
END$$

DELIMITER ;
