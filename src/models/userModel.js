const db = require("../config/db");

exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    "SELECT user_id, user_name, user_email, user_password FROM users WHERE user_email = ?",
    [email]
  );
  return rows[0] || null;
};

exports.findById = async (id) => {
  const [rows] = await db.query(
    "SELECT user_id, user_name, user_address, user_email, user_mobileno FROM users WHERE user_id = ?",
    [id]
  );
  return rows[0] || null;
};

exports.create = async ({ name, address, email, password, mobile }) => {
  const [result] = await db.query(
    "INSERT INTO users (user_name, user_address, user_email, user_password, user_mobileno) VALUES (?, ?, ?, ?, ?)",
    [name, address, email, password, mobile]
  );
  return result;
};

exports.updateAddress = async (userId, address) => {
  const [result] = await db.query(
    "UPDATE users SET user_address = ? WHERE user_id = ?",
    [address, userId]
  );
  return result;
};

exports.updateContact = async (userId, mobileno) => {
  const [result] = await db.query(
    "UPDATE users SET user_mobileno = ? WHERE user_id = ?",
    [mobileno, userId]
  );
  return result;
};

exports.updatePassword = async (userId, newPassword) => {
  const [result] = await db.query(
    "UPDATE users SET user_password = ? WHERE user_id = ?",
    [newPassword, userId]
  );
  return result;
};

exports.findByIdAndPassword = async (userId, password) => {
  const [rows] = await db.query(
    "SELECT user_id, user_name FROM users WHERE user_id = ? AND user_password = ?",
    [userId, password]
  );
  return rows[0] || null;
};
