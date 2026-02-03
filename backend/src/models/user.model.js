import { db } from "../config/db.js";

export const UserModel = {
  findByEmail: async (email) => {
    const [[row]] = await db.query(
      "SELECT u.*, r.role_name FROM user u JOIN role r ON u.role_id=r.role_id WHERE email=?",
      [email]
    );
    return row;
  },

  create: async (data) => {
    const { name, email, password_hash, department, year, role_id } = data;
    const [res] = await db.query(
      `INSERT INTO user (name,email,password_hash,department,year,role_id)
       VALUES (?,?,?,?,?,?)`,
      [name, email, password_hash, department, year, role_id]
    );
    return res.insertId;
  },

  // ✅ NEW: get role info by role_id
  getRoleById: async (role_id) => {
    const [rows] = await db.query(
      "SELECT role_name FROM role WHERE role_id = ?",
      [role_id]
    );
    return rows[0]; // { role_name: 'Student' } or undefined if invalid
  }
};
