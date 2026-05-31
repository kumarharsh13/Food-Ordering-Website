const db = require("../config/db");

exports.create = async ({ orderId, userId, itemId, quantity, price, datetime }) => {
  const [result] = await db.query(
    "INSERT INTO order_dispatch (order_id, user_id, item_id, quantity, price, datetime) VALUES (?, ?, ?, ?, ?, ?)",
    [orderId, userId, itemId, quantity, price, datetime]
  );
  return result;
};

exports.getByUserId = async (userId) => {
  const [rows] = await db.query(
    "SELECT order_dispatch.order_id, order_dispatch.user_id, order_dispatch.quantity, order_dispatch.price, order_dispatch.datetime, menu.item_id, menu.item_name, menu.item_img FROM order_dispatch, menu WHERE order_dispatch.user_id = ? AND menu.item_id = order_dispatch.item_id ORDER BY order_dispatch.datetime DESC",
    [userId]
  );
  return rows;
};
