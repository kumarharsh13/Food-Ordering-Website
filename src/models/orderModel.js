const db = require('../config/db');

exports.create = async ({ orderId, userId, itemId, quantity, price, datetime }) => {
  const [result] = await db.query(
    "INSERT INTO orders (order_id, user_id, item_id, quantity, price, datetime, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')",
    [orderId, userId, itemId, quantity, price, datetime]
  );
  return result;
};

exports.getPending = async () => {
  const [rows] = await db.query(
    "SELECT * FROM orders WHERE status = 'pending' ORDER BY datetime",
    undefined
  );
  return rows;
};

exports.getById = async (orderId) => {
  const [rows] = await db.query('SELECT * FROM orders WHERE order_id = ?', [orderId]);
  return rows[0] || null;
};

exports.setDispatched = async (orderId) => {
  const [result] = await db.query(
    "UPDATE orders SET status = 'dispatched' WHERE order_id = ?",
    [orderId]
  );
  return result;
};

exports.getByUserIdAndStatus = async (userId, status) => {
  const [rows] = await db.query(
    `SELECT orders.order_id, orders.user_id, orders.quantity, orders.price,
            orders.datetime, orders.status, menu.item_id, menu.item_name, menu.item_img
     FROM orders
     JOIN menu ON menu.item_id = orders.item_id
     WHERE orders.user_id = ? AND orders.status = ?
     ORDER BY orders.datetime DESC`,
    [userId, status]
  );
  return rows;
};
