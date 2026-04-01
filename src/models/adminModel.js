const db = require("../config/db");

exports.findByCredentials = async (email, password) => {
  const [rows] = await db.query(
    "SELECT admin_id, admin_name FROM admin WHERE admin_email = ? AND admin_password = ?",
    [email, password]
  );
  return rows[0] || null;
};

exports.findById = async (id) => {
  const [rows] = await db.query(
    "SELECT admin_id, admin_name FROM admin WHERE admin_id = ?",
    [id]
  );
  return rows[0] || null;
};
