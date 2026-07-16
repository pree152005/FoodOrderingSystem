-- =========================================================
-- FOOD ORDERING SYSTEM - DATABASE SCRIPT
-- =========================================================

CREATE DATABASE IF NOT EXISTS food_order_db;
USE food_order_db;

-- =========================================================
-- ORDERS TABLE
-- =========================================================
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS orders;

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    food_item VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price DOUBLE NOT NULL,
    address VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- PAYMENTS TABLE
-- =========================================================
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    amount DOUBLE NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_order_id FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Helpful indexes for search endpoints
CREATE INDEX idx_orders_customer_name ON orders(customer_name);
CREATE INDEX idx_orders_food_item ON orders(food_item);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_payments_order_id ON payments(order_id);

-- =========================================================
-- SAMPLE DATA (optional - for quick manual testing)
-- =========================================================
INSERT INTO orders (customer_name, food_item, quantity, price, address, status)
VALUES
('Ravi Kumar', 'Chicken Biryani', 2, 250.00, '221B MG Road, Bengaluru', 'DELIVERED'),
('Anita Sharma', 'Paneer Butter Masala', 1, 220.00, '45 Indiranagar, Bengaluru', 'PENDING');
