const db = require('../config/db');

exports.findByEmail = async (email) => {
  const [rows] = await db.query(
    'SELECT admin_id, admin_name, admin_email, admin_password FROM admin WHERE admin_email = ?',
    [email]
  );
  return rows[0] || null;
};

exports.findById = async (id) => {
  const [rows] = await db.query(
    'SELECT admin_id, admin_name FROM admin WHERE admin_id = ?',
    [id]
  );
  return rows[0] || null;
};
