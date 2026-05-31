const db = require("../config/db");

exports.create = async ({ orderId, userId, itemId, quantity, price, datetime }) => {
  const [result] = await db.query(
    "INSERT INTO orders (order_id, user_id, item_id, quantity, price, datetime) VALUES (?, ?, ?, ?, ?, ?)",
    [orderId, userId, itemId, quantity, price, datetime]
  );
  return result;
};

exports.getAll = async () => {
  const [rows] = await db.query("SELECT * FROM orders ORDER BY datetime");
  return rows;
};

exports.getById = async (orderId) => {
  const [rows] = await db.query("SELECT * FROM orders WHERE order_id = ?", [
    orderId,
  ]);
  return rows[0] || null;
};

exports.deleteById = async (orderId) => {
  const [result] = await db.query("DELETE FROM orders WHERE order_id = ?", [
    orderId,
  ]);
  return result;
};
