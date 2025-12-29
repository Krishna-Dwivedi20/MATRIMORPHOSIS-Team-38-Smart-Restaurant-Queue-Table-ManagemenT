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

-- Table buttons table
CREATE TABLE IF NOT EXISTS table_buttons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  table_id INT NOT NULL,
  button_name VARCHAR(100) NOT NULL,
  button_type ENUM('ACTION', 'STATUS', 'ALERT', 'INFO') DEFAULT 'ACTION',
  icon VARCHAR(100),
  color VARCHAR(50) DEFAULT 'primary',
  action VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (table_id) REFERENCES tables_reservations(id) ON DELETE CASCADE
);

-- Insert sample tables
INSERT INTO tables_reservations (table_number, capacity, type, status) VALUES
(1, 2, 'REGULAR', 'AVAILABLE'),
(2, 2, 'REGULAR', 'AVAILABLE'),
(3, 4, 'REGULAR', 'AVAILABLE'),
(4, 4, 'REGULAR', 'RESERVED'),
(5, 6, 'LARGE', 'AVAILABLE'),
(6, 8, 'LARGE', 'OCCUPIED'),
(7, 2, 'REGULAR', 'AVAILABLE'),
(8, 4, 'REGULAR', 'OCCUPIED'),
(9, 6, 'LARGE', 'AVAILABLE'),
(10, 8, 'LARGE', 'RESERVED');

-- Insert sample table buttons
INSERT INTO table_buttons (table_id, button_name, button_type, icon, color, action) VALUES
(1, 'Call Waiter', 'ACTION', 'call', 'primary', 'call_waiter'),
(1, 'Request Bill', 'ACTION', 'payment', 'accent', 'request_bill'),
(1, 'Ready to Leave', 'STATUS', 'exit', 'warn', 'ready_to_leave'),
(2, 'Call Waiter', 'ACTION', 'call', 'primary', 'call_waiter'),
(2, 'Request Bill', 'ACTION', 'payment', 'accent', 'request_bill'),
(3, 'Call Waiter', 'ACTION', 'call', 'primary', 'call_waiter'),
(3, 'Need Napkins', 'ALERT', 'alert', 'warn', 'need_napkins'),
(3, 'Request Bill', 'ACTION', 'payment', 'accent', 'request_bill'),
(4, 'Call Waiter', 'ACTION', 'call', 'primary', 'call_waiter'),
(5, 'Call Waiter', 'ACTION', 'call', 'primary', 'call_waiter'),
(6, 'Call Waiter', 'ACTION', 'call', 'primary', 'call_waiter');

-- Insert sample queue data
INSERT INTO queue (user_id, user_name, party_size, phone, status, estimated_time, position) VALUES
(1, 'John Doe', 2, '555-0101', 'WAITING', 15, 1),
(4, 'Sarah Johnson', 4, '555-0104', 'WAITING', 25, 2),
(5, 'Michael Brown', 3, '555-0105', 'CALLED', 5, 3),
(6, 'Emily Davis', 2, '555-0106', 'SEATED', 0, 4),
(7, 'Robert Wilson', 5, '555-0107', 'WAITING', 35, 5),
(8, 'Lisa Anderson', 3, '555-0108', 'WAITING', 20, 6),
(9, 'David Martinez', 2, '555-0109', 'CANCELLED', NULL, NULL),
(10, 'Jennifer Taylor', 6, '555-0110', 'SEATED', 0, 7),
(1, 'John Doe', 4, '555-0101', 'WAITING', 30, 8),
(2, 'Jane Smith', 2, '555-0102', 'WAITING', 10, 9);

-- Insert sample users
INSERT INTO users (name, email, phone, role) VALUES
('John Doe', 'john@example.com', '555-0101', 'USER'),
('Jane Smith', 'jane@example.com', '555-0102', 'MANAGER'),
('Admin User', 'admin@example.com', '555-0103', 'ADMIN'),
('Sarah Johnson', 'sarah.johnson@example.com', '555-0104', 'USER'),
('Michael Brown', 'michael.brown@example.com', '555-0105', 'USER'),
('Emily Davis', 'emily.davis@example.com', '555-0106', 'MANAGER'),
('Robert Wilson', 'robert.wilson@example.com', '555-0107', 'USER'),
('Lisa Anderson', 'lisa.anderson@example.com', '555-0108', 'USER'),
('David Martinez', 'david.martinez@example.com', '555-0109', 'USER'),
('Jennifer Taylor', 'jennifer.taylor@example.com', '555-0110', 'MANAGER');
