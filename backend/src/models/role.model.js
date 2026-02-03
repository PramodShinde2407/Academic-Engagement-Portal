import { db } from "../config/db.js";

export const RoleModel = {
  /**
   * Fetch all roles
   */
  getAll: async () => {
    const [rows] = await db.query(
      "SELECT role_id, role_name FROM role ORDER BY role_id"
    );
    return rows;
  },

  /**
   * Find role by ID
   */
  findById: async (role_id) => {
    const [[row]] = await db.query(
      "SELECT role_id, role_name FROM role WHERE role_id = ?",
      [role_id]
    );
    return row;
  },

  /**
   * Find role by name (optional utility)
   */
  findByName: async (role_name) => {
    const [[row]] = await db.query(
      "SELECT role_id, role_name FROM role WHERE role_name = ?",
      [role_name]
    );
    return row;
  }
};
