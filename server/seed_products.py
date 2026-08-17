import pymysql
from config import get_config


config = get_config()

db = pymysql.connect(
    host=config.DB_HOST,
    user=config.DB_USER,
    password=config.DB_PASSWORD,
    database=config.DB_NAME,
    port=int(config.DB_PORT),
    charset="utf8mb4"
)

cursor = db.cursor()

products = [
    # Electronics & Laptops
    (
        1,
        "Dell Inspiron 15 Laptop",
        "dell-inspiron-15-laptop",
        "Powerful laptop for work, study and everyday use.",
        "Dell",
        54999.00,
        64999.00,
        15.38,
        25,
        5,
        ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853"],
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
        ["laptop", "dell", "computer"],
        {"processor": "Intel Core i5", "ram": "16GB", "storage": "512GB SSD"},
        ["Silver"],
        ["15.6 inch"],
        1,
        1,
        1
    ),

    (
        1,
        "HP Pavilion Laptop",
        "hp-pavilion-laptop",
        "Reliable laptop for productivity and entertainment.",
        "HP",
        62999.00,
        72999.00,
        13.70,
        20,
        5,
        ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed"],
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
        ["laptop", "hp", "computer"],
        {"processor": "Intel Core i7", "ram": "16GB", "storage": "1TB SSD"},
        ["Natural Silver"],
        ["15.6 inch"],
        1,
        0,
        1
    ),

    # Smartphones
    (
        2,
        "Samsung Galaxy S24",
        "samsung-galaxy-s24",
        "Premium smartphone with excellent camera and performance.",
        "Samsung",
        69999.00,
        79999.00,
        12.50,
        30,
        5,
        ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"],
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
        ["smartphone", "samsung", "android"],
        {"ram": "8GB", "storage": "256GB", "display": "6.2 inch"},
        ["Black", "Blue", "Violet"],
        ["128GB", "256GB"],
        1,
        1,
        1
    ),

    (
        2,
        "Apple iPhone 15",
        "apple-iphone-15",
        "Powerful Apple smartphone with advanced camera system.",
        "Apple",
        69900.00,
        79900.00,
        12.52,
        35,
        5,
        ["https://images.unsplash.com/photo-1592899677977-9c10ca588bbd"],
        "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
        ["iphone", "apple", "smartphone"],
        {"storage": "128GB", "display": "6.1 inch", "chip": "A16 Bionic"},
        ["Black", "Blue", "Pink"],
        ["128GB", "256GB"],
        1,
        1,
        0
    ),

    # Sports & Footwear
    (
        3,
        "Nike Air Max Running Shoes",
        "nike-air-max-running-shoes",
        "Comfortable running shoes designed for everyday training.",
        "Nike",
        7999.00,
        9999.00,
        20.00,
        50,
        10,
        ["https://images.unsplash.com/photo-1542291026-7eec264c27ff"],
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
        ["shoes", "nike", "running"],
        {"type": "Running", "material": "Mesh", "sole": "Rubber"},
        ["Black", "White", "Red"],
        ["7", "8", "9", "10"],
        1,
        1,
        1
    ),

    (
        3,
        "Adidas Ultraboost Shoes",
        "adidas-ultraboost-shoes",
        "High-performance running shoes with responsive cushioning.",
        "Adidas",
        8999.00,
        10999.00,
        18.18,
        40,
        8,
        ["https://images.unsplash.com/photo-1608231387042-66d1773070a5"],
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5",
        ["shoes", "adidas", "running"],
        {"type": "Running", "material": "Primeknit", "sole": "Rubber"},
        ["White", "Black"],
        ["7", "8", "9", "10", "11"],
        1,
        0,
        1
    ),

    # Gaming Consoles
    (
        4,
        "PlayStation 5",
        "playstation-5",
        "Next-generation gaming console with immersive gameplay.",
        "Sony",
        49990.00,
        54990.00,
        9.09,
        15,
        3,
        ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db"],
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db",
        ["gaming", "playstation", "console"],
        {"storage": "825GB SSD", "resolution": "4K", "type": "Disc Edition"},
        ["White"],
        [],
        1,
        1,
        0
    ),

    (
        4,
        "Xbox Series X",
        "xbox-series-x",
        "Powerful gaming console for high-performance gaming.",
        "Microsoft",
        49990.00,
        54990.00,
        9.09,
        18,
        3,
        ["https://images.unsplash.com/photo-1621259182978-fbf93132d53d"],
        "https://images.unsplash.com/photo-1621259182978-fbf93132d53d",
        ["gaming", "xbox", "console"],
        {"storage": "1TB SSD", "resolution": "4K", "type": "Series X"},
        ["Black"],
        [],
        1,
        0,
        0
    ),

    # Audio & Headphones
    (
        5,
        "Sony WH-1000XM5 Headphones",
        "sony-wh-1000xm5-headphones",
        "Premium wireless headphones with industry-leading noise cancellation.",
        "Sony",
        29990.00,
        34990.00,
        14.29,
        25,
        5,
        ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e"],
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        ["headphones", "sony", "wireless"],
        {"type": "Over Ear", "battery": "30 hours", "connectivity": "Bluetooth"},
        ["Black", "Silver"],
        [],
        1,
        1,
        1
    ),

    (
        5,
        "Apple AirPods Pro",
        "apple-airpods-pro",
        "Wireless earbuds with active noise cancellation.",
        "Apple",
        24900.00,
        26900.00,
        7.43,
        45,
        8,
        ["https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1"],
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1",
        ["airpods", "apple", "earbuds"],
        {"type": "In Ear", "battery": "6 hours", "connectivity": "Bluetooth"},
        ["White"],
        [],
        1,
        1,
        0
    ),

    # Home & Kitchen
    (
        6,
        "Philips Air Fryer",
        "philips-air-fryer",
        "Healthy cooking with rapid air technology.",
        "Philips",
        7999.00,
        9999.00,
        20.00,
        30,
        5,
        ["https://images.unsplash.com/photo-1585515320310-259814833e62"],
        "https://images.unsplash.com/photo-1585515320310-259814833e62",
        ["air-fryer", "philips", "kitchen"],
        {"capacity": "4.1L", "power": "1400W", "type": "Digital"},
        ["Black"],
        [],
        1,
        0,
        1
    ),

    (
        6,
        "Prestige Electric Kettle",
        "prestige-electric-kettle",
        "Fast boiling electric kettle for home and office.",
        "Prestige",
        1499.00,
        1999.00,
        25.01,
        60,
        10,
        ["https://images.unsplash.com/photo-1594213114663-d94db9b171ef"],
        "https://images.unsplash.com/photo-1594213114663-d94db9b171ef",
        ["kettle", "prestige", "kitchen"],
        {"capacity": "1.5L", "power": "1500W", "material": "Stainless Steel"},
        ["Silver"],
        [],
        1,
        0,
        0
    ),
]


sql = """
INSERT INTO products (
    category_id,
    name,
    slug,
    description,
    brand,
    price,
    original_price,
    discount_percent,
    stock,
    low_stock_alert,
    images,
    thumbnail,
    tags,
    specifications,
    colors,
    sizes,
    is_active,
    is_featured,
    is_new_arrival,
    views_count,
    sold_count,
    avg_rating,
    review_count
)
VALUES (
    %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
    %s, %s, %s, %s, %s, %s, %s, %s, %s,
    %s, %s, %s, %s
)
"""

import json

for product in products:
    product = list(product)

    for index in [10, 12, 13, 14, 15]:
        product[index] = json.dumps(product[index])

    # Default product statistics
    product.extend([
        0,      # views_count
        0,      # sold_count
        0.0,    # avg_rating
        0       # review_count
    ])

    cursor.execute(sql, product)

db.commit()

print("================================")
print("PRODUCT SEED COMPLETE!")
print(f"Products inserted: {len(products)}")
print("================================")

cursor.execute("SELECT id, category_id, name, price, stock FROM products ORDER BY id")

for row in cursor.fetchall():
    print(row)

cursor.close()
db.close()