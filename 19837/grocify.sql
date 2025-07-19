-- 📦 Create database (if not already)
CREATE DATABASE IF NOT EXISTS grocify;
USE grocify;

-- 👤 Users table (for signup/login)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255)
);

-- 🔐 Admin table
CREATE TABLE IF NOT EXISTS admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL
);

-- 🛒 Orders table
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  address TEXT,
  order_summary TEXT,
  total_price INT,
  status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🧺 Order Items table (optional if you want itemized breakdown)
CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_name VARCHAR(100),
  quantity INT,
  price INT,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 🛍️ Products table
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  price INT,
  image_path VARCHAR(255),
  category VARCHAR(50),
  stock INT DEFAULT 100
);

-- ✅ Insert sample admin
INSERT INTO admin (email, password) VALUES ('admin@gmail.com', 'admin123');

-- ✅ Insert sample products
INSERT INTO products (name, price, image_path, category) VALUES
('Potato', 29, 'image/potato.png', 'Vegetables'),
('Onion', 29, 'image/onion.png', 'Vegetables'),
('Milk', 45, 'image/milk.png', 'Dairy'),
('Cheese', 75, 'image/cheese.jpeg', 'Dairy'),
('Butter', 40, 'image/butter.jpeg', 'Dairy'),
('Apple', 120, 'image/apple.png', 'Fruits'),
('Banana', 45, 'image/banana.png', 'Fruits'),
('Potato Chips', 20, 'image/chips.png', 'Snacks'),
('Chocolate Cookies', 50, 'image/choco.jpeg', 'Snacks'),
('Orange Juice', 75, 'image/fanta.png', 'Beverages'),
('Cola Soda', 40, 'image/coka.png', 'Beverages');
