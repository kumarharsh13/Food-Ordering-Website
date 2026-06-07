-- Add status column to orders table
ALTER TABLE orders ADD COLUMN status ENUM('pending', 'dispatched') NOT NULL DEFAULT 'pending';

-- Mark any existing orders that are already in order_dispatch as dispatched
UPDATE orders o
  JOIN order_dispatch od ON o.order_id = od.order_id
  SET o.status = 'dispatched';

-- Copy dispatched rows that only exist in order_dispatch (not in orders)
INSERT IGNORE INTO orders (order_id, user_id, item_id, quantity, price, datetime, status)
SELECT order_id, user_id, item_id, quantity, price, datetime, 'dispatched'
FROM order_dispatch
WHERE order_id NOT IN (SELECT order_id FROM orders);

-- Drop the redundant table
DROP TABLE order_dispatch;
