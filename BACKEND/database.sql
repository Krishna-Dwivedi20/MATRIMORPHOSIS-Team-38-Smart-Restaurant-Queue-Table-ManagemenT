-- Create database
CREATE DATABASE IF NOT EXISTS restaurant_db;
USE restaurant_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(15),
  role ENUM('USER', 'MANAGER', 'ADMIN') DEFAULT 'USER',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tables reservations table
CREATE TABLE IF NOT EXISTS tables_reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_number INT NOT NULL UNIQUE,
  capacity INT NOT NULL,
  type VARCHAR(50) DEFAULT 'REGULAR',
  status ENUM('AVAILABLE', 'RESERVED', 'OCCUPIED') DEFAULT 'AVAILABLE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Queue table
CREATE TABLE IF NOT EXISTS queue (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  user_name VARCHAR(100),
  party_size INT NOT NULL,
  phone VARCHAR(15),
  status ENUM('WAITING', 'CALLED', 'SEATED', 'CANCELLED') DEFAULT 'WAITING',
  estimated_time INT,
  position INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample tables
INSERT INTO tables_reservations (table_number, capacity, type, status) VALUES
(1, 2, 'REGULAR', 'AVAILABLE'),
(2, 2, 'REGULAR', 'AVAILABLE'),
(3, 4, 'REGULAR', 'AVAILABLE'),
(4, 4, 'REGULAR', 'RESERVED'),
(5, 6, 'LARGE', 'AVAILABLE'),
(6, 8, 'LARGE', 'OCCUPIED');

-- Insert sample users
INSERT INTO users (name, email, phone, role) VALUES
('John Doe', 'john@example.com', '555-0101', 'USER'),
('Jane Smith', 'jane@example.com', '555-0102', 'MANAGER'),
('Admin User', 'admin@example.com', '555-0103', 'ADMIN');
