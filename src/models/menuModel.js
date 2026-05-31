const db = require("../config/db");

exports.getAll = async () => {
  const [rows] = await db.query("SELECT * FROM menu");
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM menu WHERE item_id = ?", [id]);
  return rows[0] || null;
};

exports.getByIds = async (ids) => {
  if (!ids.length) return [];
  const [rows] = await db.query("SELECT * FROM menu WHERE item_id IN (?)", [
    ids,
  ]);
  return rows;
};

exports.addItem = async ({
  name,
  type,
  category,
  serving,
  calories,
  price,
  rating,
  img,
}) => {
  const [result] = await db.query(
    "INSERT INTO menu (item_name, item_type, item_category, item_serving, item_calories, item_price, item_rating, item_img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [name, type, category, serving, calories, price, rating, img]
  );
  return result;
};

exports.updatePrice = async (itemName, newPrice) => {
  const [result] = await db.query(
    "UPDATE menu SET item_price = ? WHERE item_name = ?",
    [newPrice, itemName]
  );
  return result;
};

exports.findByName = async (itemName) => {
  const [rows] = await db.query(
    "SELECT item_name FROM menu WHERE item_name = ?",
    [itemName]
  );
  return rows[0] || null;
};
