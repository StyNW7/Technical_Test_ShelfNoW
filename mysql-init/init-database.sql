-- Create databases for each microservice
CREATE DATABASE IF NOT EXISTS shelfnow_auth_db;
CREATE DATABASE IF NOT EXISTS shelfnow_product_db;
CREATE DATABASE IF NOT EXISTS shelfnow_order_db;

-- Create dedicated users for each service (optional but recommended for production)
CREATE USER IF NOT EXISTS 'auth_user'@'%' IDENTIFIED BY 'auth_password';
CREATE USER IF NOT EXISTS 'product_user'@'%' IDENTIFIED BY 'product_password';
CREATE USER IF NOT EXISTS 'order_user'@'%' IDENTIFIED BY 'order_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON shelfnow_auth_db.* TO 'auth_user'@'%';
GRANT ALL PRIVILEGES ON shelfnow_product_db.* TO 'product_user'@'%';
GRANT ALL PRIVILEGES ON shelfnow_order_db.* TO 'order_user'@'%';

FLUSH PRIVILEGES;