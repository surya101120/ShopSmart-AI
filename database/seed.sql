-- ============================================================
-- ShopSmart AI - Seed Data
-- ============================================================

--  USE shopsmart_ai;

-- ============================================================
-- ADMINS
-- ============================================================
INSERT INTO admins (name, email, password_hash, role) VALUES
('Super Admin', 'admin@shopsmart.ai', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGma.8F2n3uG2aGkP.PvOE6mKS2', 'super_admin'),
('Store Manager', 'manager@shopsmart.ai', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGma.8F2n3uG2aGkP.PvOE6mKS2', 'manager');
-- Password for both: Admin@1234



-- ============================================================
-- SAMPLE USER
-- ============================================================
INSERT INTO users (name, email, password_hash, phone, is_email_verified, is_active) VALUES
('Raj Kumar',   'raj@example.com',   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGma.8F2n3uG2aGkP.PvOE6mKS2', '9876543210', TRUE, TRUE),
('Priya Singh', 'priya@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGma.8F2n3uG2aGkP.PvOE6mKS2', '9876543211', TRUE, TRUE),
('Arjun Mehta', 'arjun@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGma.8F2n3uG2aGkP.PvOE6mKS2', '9876543212', TRUE, TRUE);
-- Password for all: Admin@1234

-- ============================================================
-- PRODUCTS - Electronics: Laptops
-- ============================================================
INSERT INTO products (category_id, name, slug, description, short_description, brand, sku, price, original_price, discount_percent, stock, low_stock_alert, images, thumbnail, tags, specifications, is_active, is_featured, is_new_arrival) VALUES
(1, 'Dell Inspiron 15 Gaming Laptop', 'dell-inspiron-15-gaming',
 'Powerful gaming laptop with Intel Core i7 12th Gen processor, NVIDIA RTX 3050 graphics, 16GB DDR5 RAM and 512GB NVMe SSD. Perfect for gaming, content creation and professional work.',
 'Intel i7, RTX 3050, 16GB RAM, 512GB SSD - Under ₹60,000',
 'Dell', 'DELL-INS-15-001', 58999.00, 74999.00, 21.34, 25, 5,
 '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=600","https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600"]',
 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
 '["gaming laptop","dell","i7","rtx 3050","laptop under 60000"]',
 '{"Processor":"Intel Core i7-12650H","RAM":"16GB DDR5","Storage":"512GB NVMe SSD","Display":"15.6 inch FHD 144Hz","Graphics":"NVIDIA RTX 3050 4GB","Battery":"54WHr","OS":"Windows 11 Home","Weight":"2.1 kg"}',
 TRUE, TRUE, FALSE),

(1, 'ASUS VivoBook 15 Laptop', 'asus-vivobook-15',
 'Slim and lightweight laptop for everyday use. Powered by AMD Ryzen 5 5500U with Radeon graphics, 8GB RAM and 512GB SSD. Ideal for students and professionals.',
 'AMD Ryzen 5, 8GB RAM, 512GB SSD - Best Value',
 'ASUS', 'ASUS-VB15-001', 42999.00, 52999.00, 18.87, 40, 10,
 '["https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600"]',
 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
 '["laptop","asus","ryzen 5","student laptop","budget laptop"]',
 '{"Processor":"AMD Ryzen 5 5500U","RAM":"8GB DDR4","Storage":"512GB SSD","Display":"15.6 inch FHD","Graphics":"AMD Radeon Integrated","Battery":"42WHr","OS":"Windows 11 Home","Weight":"1.8 kg"}',
 TRUE, FALSE, FALSE),

(1, 'MacBook Air M2', 'macbook-air-m2',
 'The all-new MacBook Air with Apple M2 chip delivers incredible performance and up to 18 hours of battery life. Ultra-thin design with stunning Liquid Retina display.',
 'Apple M2 chip, 8GB RAM, 256GB SSD, 18hr battery',
 'Apple', 'APPLE-MBA-M2-001', 114900.00, 124900.00, 8.01, 15, 3,
 '["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600"]',
 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
 '["macbook","apple","m2","premium laptop","macbook air"]',
 '{"Processor":"Apple M2","RAM":"8GB Unified Memory","Storage":"256GB SSD","Display":"13.6 inch Liquid Retina","Battery":"Up to 18 hours","OS":"macOS Ventura","Weight":"1.24 kg"}',
 TRUE, TRUE, TRUE),

(1, 'HP Pavilion x360 2-in-1', 'hp-pavilion-x360-2in1',
 'Versatile 2-in-1 laptop that transforms from laptop to tablet. Intel Core i5 12th Gen, 8GB RAM, 512GB SSD with touchscreen display.',
 'Intel i5, 8GB RAM, 512GB SSD, Touch 2-in-1 Convertible',
 'HP', 'HP-PAV-X360-001', 54999.00, 64999.00, 15.39, 20, 5,
 '["https://images.unsplash.com/photo-1544099858-75516a9e5b28?w=600"]',
 'https://images.unsplash.com/photo-1544099858-75516a9e5b28?w=400',
 '["hp laptop","2-in-1","touchscreen","convertible laptop","i5"]',
 '{"Processor":"Intel Core i5-1235U","RAM":"8GB DDR4","Storage":"512GB SSD","Display":"14 inch FHD Touch","Battery":"43WHr","OS":"Windows 11 Home","Weight":"1.75 kg"}',
 TRUE, FALSE, TRUE);

-- ============================================================
-- PRODUCTS - Electronics: Smartphones
-- ============================================================
INSERT INTO products (category_id, name, slug, description, short_description, brand, sku, price, original_price, discount_percent, stock, low_stock_alert, images, thumbnail, tags, specifications, colors, is_active, is_featured) VALUES
(2, 'Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra',
 'The pinnacle of Samsung innovation with S Pen, 200MP camera, Snapdragon 8 Gen 3 and titanium design. Ultimate productivity and creativity smartphone.',
 '200MP Camera, S Pen, Snapdragon 8 Gen 3, 12GB RAM',
 'Samsung', 'SAM-S24U-001', 134999.00, 149999.00, 10.00, 20, 5,
 '["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600"]',
 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
 '["samsung","s24 ultra","flagship phone","s pen","5g phone"]',
 '{"Display":"6.8 inch QHD+ AMOLED 120Hz","Processor":"Snapdragon 8 Gen 3","RAM":"12GB","Storage":"256GB","Camera":"200MP+12MP+50MP+10MP","Battery":"5000mAh","OS":"Android 14","5G":"Yes"}',
 '["Titanium Black","Titanium Gray","Titanium Violet","Titanium Yellow"]',
 TRUE, TRUE),

(2, 'iPhone 15 Pro Max', 'iphone-15-pro-max',
 'Apple iPhone 15 Pro Max with A17 Pro chip, titanium design, ProRAW camera system and USB-C. Experience the most powerful iPhone ever made.',
 'A17 Pro chip, 48MP Camera, Titanium Design, USB-C',
 'Apple', 'APPLE-IP15PM-001', 159900.00, 174900.00, 8.58, 12, 3,
 '["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"]',
 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
 '["iphone","apple","iphone 15","flagship","ios"]',
 '{"Display":"6.7 inch Super Retina XDR","Processor":"A17 Pro","RAM":"8GB","Storage":"256GB","Camera":"48MP Main + 12MP Ultra Wide + 12MP Telephoto","Battery":"4422mAh","OS":"iOS 17"}',
 '["Natural Titanium","Blue Titanium","White Titanium","Black Titanium"]',
 TRUE, TRUE),

(2, 'OnePlus 12R 5G', 'oneplus-12r-5g',
 'Flagship killer from OnePlus with Snapdragon 8 Gen 2, 50MP triple camera, 80W SUPERVOOC charging and OxygenOS 14 for a smooth experience.',
 'Snapdragon 8 Gen 2, 50MP Camera, 80W Charging, 8GB RAM',
 'OnePlus', 'OP-12R-001', 39999.00, 49999.00, 20.00, 35, 8,
 '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600"]',
 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
 '["oneplus","5g phone","snapdragon","budget flagship","oxygenos"]',
 '{"Display":"6.78 inch AMOLED 120Hz","Processor":"Snapdragon 8 Gen 2","RAM":"8GB","Storage":"128GB","Camera":"50MP+8MP+2MP","Battery":"5500mAh 80W","OS":"OxygenOS 14"}',
 '["Iron Gray","Cool Blue"]',
 TRUE, FALSE),

(2, 'Redmi Note 13 Pro+', 'redmi-note-13-pro-plus',
 'Feature-packed mid-range phone with 200MP camera, Dimensity 7200 Ultra, 120W HyperCharge. Incredible value for money smartphone.',
 '200MP Camera, 120W HyperCharge, 12GB RAM, AMOLED',
 'Xiaomi', 'REDMI-N13PP-001', 31999.00, 37999.00, 15.79, 50, 10,
 '["https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600"]',
 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400',
 '["redmi","xiaomi","200mp camera","miui","midrange phone"]',
 '{"Display":"6.67 inch AMOLED 120Hz","Processor":"Dimensity 7200 Ultra","RAM":"12GB","Storage":"256GB","Camera":"200MP+8MP+2MP","Battery":"5000mAh 120W","OS":"MIUI 14"}',
 '["Midnight Black","Aurora Purple","Fusion Purple"]',
 TRUE, FALSE);

-- ============================================================
-- PRODUCTS - Sports
-- ============================================================
INSERT INTO products (category_id, name, slug, description, short_description, brand, sku, price, original_price, discount_percent, stock, low_stock_alert, images, thumbnail, tags, specifications, colors, sizes, is_active, is_featured) VALUES
(3, 'Nike Air Max 270 Running Shoes', 'nike-air-max-270',
 'Experience maximum cushioning with the Nike Air Max 270. Features the largest heel Air unit yet for all-day comfort. Mesh upper for breathability.',
 'Max Air cushioning, Mesh upper, Lightweight comfort',
 'Nike', 'NIKE-AM270-001', 8495.00, 10995.00, 22.74, 60, 10,
 '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"]',
 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
 '["nike","running shoes","air max","sports shoes","gym shoes"]',
 '{"Upper":"Mesh","Sole":"Rubber","Closure":"Lace-up","Activity":"Running, Gym","Country":"Vietnam"}',
 '["Black/White","White/Blue","Red/Black","Grey/Orange"]',
 '["UK 6","UK 7","UK 8","UK 9","UK 10","UK 11"]',
 TRUE, TRUE),

(3, 'Adidas Ultraboost 22 Shoes', 'adidas-ultraboost-22',
 'Adidas Ultraboost 22 with BOOST midsole for incredible energy return. Primeknit+ upper adapts to your foot shape for a perfect fit.',
 'BOOST midsole, Primeknit+ upper, Energy return technology',
 'Adidas', 'ADIDAS-UB22-001', 12999.00, 17999.00, 27.78, 30, 5,
 '["https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600"]',
 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
 '["adidas","ultraboost","running shoes","premium shoes"]',
 '{"Upper":"Primeknit+","Midsole":"BOOST","Outsole":"Continental Rubber","Activity":"Running"}',
 '["Core Black","Cloud White","Legend Ink"]',
 '["UK 6","UK 7","UK 8","UK 9","UK 10","UK 11"]',
 TRUE, FALSE),

(3, 'Fitbit Charge 6 Fitness Tracker', 'fitbit-charge-6',
 'Advanced fitness tracker with built-in GPS, heart rate monitoring, sleep tracking, and 7-day battery life. Google Maps integration and YouTube Music control.',
 'GPS, Heart Rate, Sleep Tracking, 7-day battery',
 'Fitbit', 'FITBIT-C6-001', 14999.00, 17999.00, 16.67, 25, 5,
 '["https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600"]',
 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
 '["fitbit","fitness tracker","smartwatch","health tracker","gps watch"]',
 '{"Display":"Color AMOLED","GPS":"Built-in","Battery":"7 days","Water Resistance":"50m","Sensors":"Heart Rate, SpO2, Stress, EDA"}',
 '["Obsidian","Porcelain","Coral"]',
 NULL,
 TRUE, FALSE);

-- ============================================================
-- PRODUCTS - Headphones
-- ============================================================
INSERT INTO products (category_id, name, slug, description, short_description, brand, sku, price, original_price, discount_percent, stock, images, thumbnail, tags, specifications, colors, is_active, is_featured) VALUES
(5, 'Sony WH-1000XM5 Headphones', 'sony-wh-1000xm5',
 'Industry-leading noise cancellation with HD sound. Dual Noise Sensor technology, precise voice pickup, and up to 30-hour battery. Premium over-ear wireless headphones.',
 'Industry-best ANC, 30hr battery, Hi-Res Audio',
 'Sony', 'SONY-XM5-001', 29990.00, 34990.00, 14.29, 20,
 '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"]',
 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
 '["sony","noise cancelling","headphones","wireless","xm5"]',
 '{"Driver":"30mm","Frequency":"4Hz-40kHz","Battery":"30 hours","Charging":"USB-C 3.5hr","Connectivity":"Bluetooth 5.2","ANC":"Yes","Multipoint":"Yes"}',
 '["Midnight Black","Platinum Silver"]',
 TRUE, TRUE),

(5, 'boAt Rockerz 550 Wireless', 'boat-rockerz-550',
 'Premium over-ear wireless headphones with 20 hours battery, 40mm dynamic drivers and foldable design. Best value wireless headphones in India.',
 '20hr Battery, 40mm Drivers, Deep Bass, Foldable',
 'boAt', 'BOAT-R550-001', 1299.00, 2999.00, 56.69, 100,
 '["https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600"]',
 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
 '["boat","wireless headphones","budget headphones","bluetooth"]',
 '{"Driver":"40mm","Battery":"20 hours","Charging":"Micro USB","Connectivity":"Bluetooth 5.0","Foldable":"Yes"}',
 '["Luscious Black","Mint Green","Jazzy Blue","Cherry Red"]',
 TRUE, FALSE);

-- ============================================================
-- PRODUCTS - Home & Kitchen
-- ============================================================
INSERT INTO products (category_id, name, slug, description, short_description, brand, sku, price, original_price, discount_percent, stock, images, thumbnail, tags, specifications, is_active) VALUES
(6, 'Instant Pot Duo 7-in-1', 'instant-pot-duo-7in1',
 '7-in-1 multi-use programmable pressure cooker, slow cooker, rice cooker, steamer, sauté pan, food warmer, and yogurt maker. 6 quart capacity.',
 '7-in-1 Multifunctional, Pressure Cooker, 6 Quart',
 'Instant Pot', 'INSTPOT-DUO-001', 8499.00, 10999.00, 22.73, 30,
 '["https://images.unsplash.com/photo-1585515320310-259814833e62?w=600"]',
 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400',
 '["instant pot","pressure cooker","kitchen appliance","cooking","slow cooker"]',
 '{"Capacity":"6 Quart","Functions":"7 in 1","Power":"1000W","Programs":"13 Smart Programs","Safety":"10+ Safety Mechanisms"}',
 TRUE),

(6, 'Dyson V12 Detect Slim Vacuum', 'dyson-v12-detect-slim',
 'Powerful cordless vacuum with laser dust detection, HEPA filtration and up to 60 minutes of run time. Automatically adapts suction power to different floor types.',
 'Laser Detect, 60min Runtime, HEPA Filter, Cordless',
 'Dyson', 'DYSON-V12-001', 49900.00, 54900.00, 9.11, 10,
 '["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"]',
 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
 '["dyson","vacuum cleaner","cordless vacuum","premium appliance"]',
 '{"Battery":"60 min","Suction":"150 AW","Filtration":"HEPA","Weight":"2.2 kg","Bin Volume":"0.35L"}',
 TRUE);

-- ============================================================
-- PRODUCTS - Gaming
-- ============================================================
INSERT INTO products (category_id, name, slug, description, short_description, brand, sku, price, original_price, discount_percent, stock, images, thumbnail, tags, specifications, is_active, is_featured) VALUES
(4, 'Sony PlayStation 5', 'sony-playstation-5',
 'Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with support for haptic feedback, adaptive triggers and 3D Audio. Play the greatest PS5 games.',
 'Ultra-HD Blu-ray, 825GB SSD, Haptic Feedback, 4K Gaming',
 'Sony', 'SONY-PS5-001', 54990.00, 59990.00, 8.34, 8,
 '["https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600"]',
 'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=400',
 '["ps5","playstation","gaming console","sony","4k gaming"]',
 '{"CPU":"AMD Zen 2 8-core 3.5GHz","GPU":"AMD RDNA 2 10.28 TFLOPS","RAM":"16GB GDDR6","Storage":"825GB SSD","Optical Drive":"Ultra HD Blu-ray","Resolution":"Up to 8K"}',
 TRUE, TRUE),

(4, 'Razer BlackWidow V3 Mechanical Keyboard', 'razer-blackwidow-v3',
 'Iconic mechanical gaming keyboard with Razer Green Switches, Razer Chroma RGB, and tactile feedback for satisfying gaming performance.',
 'Razer Green Switches, Chroma RGB, Tactile & Clicky',
 'Razer', 'RAZER-BW3-001', 8999.00, 11999.00, 25.01, 25,
 '["https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600"]',
 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
 '["razer","mechanical keyboard","gaming keyboard","rgb keyboard"]',
 '{"Switch":"Razer Green","Layout":"Full size","Backlight":"Razer Chroma RGB","Connection":"USB","Actuation":"1.9mm"}',
 TRUE, FALSE);

-- ============================================================
-- COUPONS
-- ============================================================
INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, is_active, starts_at, expires_at) VALUES
('WELCOME20',  'Welcome offer - 20% off on first order', 'percentage', 20.00, 500.00,  2000.00, 1000, TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 1 YEAR)),
('FESTIVE50',  'Festive season flat ₹50 off',           'flat',        50.00, 299.00,  NULL,    500,  TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY)),
('SAVE500',    'Flat ₹500 off on orders above ₹5000',  'flat',       500.00, 5000.00, NULL,    200,  TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 60 DAY)),
('ELECTRONICS10','10% off on Electronics',              'percentage', 10.00, 2000.00, 5000.00, 300,  TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 45 DAY)),
('FLASH30',    'Flash sale 30% off',                   'percentage', 30.00, 1000.00, 3000.00, 100,  TRUE, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY));

-- ============================================================
-- INVENTORY (sync with products)
-- ============================================================
INSERT INTO inventory (product_id, quantity, low_stock_threshold)
SELECT id, stock, low_stock_alert FROM products;

-- ============================================================
-- SAMPLE REVIEWS
-- ============================================================
INSERT INTO reviews (product_id, user_id, rating, title, body, is_verified, is_approved) VALUES
(1, 1, 5, 'Excellent Gaming Laptop!', 'Runs all games at high settings smoothly. Great build quality and the screen is stunning. Battery could be better but overall amazing value for money.', TRUE, TRUE),
(1, 2, 4, 'Good performance, slight heating', 'Performance is great for the price. Gets a bit warm under heavy gaming but thats expected. Cooling pad recommended.', TRUE, TRUE),
(5, 1, 5, 'Best phone I have ever used', 'The S Pen is a game changer. Camera quality is insane and the display is gorgeous. Worth every rupee.', TRUE, TRUE),
(9, 3, 5, 'Worth every penny', 'The noise cancellation is absolutely incredible. Use it daily for office calls and music. Sound quality is top notch.', TRUE, TRUE),
(13, 2, 4, 'Amazing console', 'PS5 is incredible. Loading times are insanely fast. DualSense haptics feel amazing. Hard to find in stock though.', TRUE, TRUE);

-- Update product ratings (triggers will handle future inserts)
UPDATE products p
JOIN (SELECT product_id, AVG(rating) AS avg_r, COUNT(*) AS cnt FROM reviews WHERE is_approved=TRUE GROUP BY product_id) r
ON p.id = r.product_id
SET p.avg_rating = r.avg_r, p.review_count = r.cnt;
