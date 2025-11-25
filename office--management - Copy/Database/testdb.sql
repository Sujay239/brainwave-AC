DROP DATABASE IF EXISTS testdb;
CREATE DATABASE IF NOT EXISTS testdb;
USE testdb;
-- Create users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  join_date DATE NOT NULL,
  check_in_time TIME NOT NULL,
  check_out_time TIME NOT NULL,
  left_date DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (name, email, password, role, join_date, check_in_time, check_out_time) VALUES
('admin', 'admin@test.com', '$2b$10$PcfuV4IeJ4v4JarCeN8HMOpS5YZNFy/KSzOy1xN7cWssehPlUVPC6', 'admin', '2023-01-10', '09:00', '17:00'),
('user', 'user@test.com', '$2b$10$PcfuV4IeJ4v4JarCeN8HMOpS5YZNFy/KSzOy1xN7cWssehPlUVPC6', 'user', '2023-01-11', '09:00', '17:00');


-- Table: tasks
CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table: chat
CREATE TABLE chat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id)
);

-- Table: attendes (attendance)
CREATE TABLE attendes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  date DATE NOT NULL,
  check_in_time TIME,
  check_out_time TIME,
  status VARCHAR(50) DEFAULT 'present',
  FOREIGN KEY (user_id) REFERENCES users(id),
  UNIQUE KEY unique_user_date (user_id, date)
);

-- Table: office_in_out (for office entry/exit logs)
CREATE TABLE office_in_out (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  in_time TIME,
  out_time TIME,
  remarks VARCHAR(255),
  on_off TINYINT DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table: other_settings (user or global settings)
CREATE TABLE other_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  setting_key VARCHAR(100) NOT NULL,
  setting_value VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table: dashboard (summary or widgets per user)
CREATE TABLE dashboard (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  widget_name VARCHAR(100) NOT NULL,
  widget_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);




