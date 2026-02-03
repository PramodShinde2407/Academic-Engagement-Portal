import { db } from "../config/db.js";


export const ClubModel = {
  create: async ({ name, description, club_head_id, secret_key }) => {
    const [res] = await db.query(
      "INSERT INTO club (name, description, club_head_id, secret_key) VALUES (?, ?, ?, ?)",
      [name, description, club_head_id, secret_key]
    );
    return res.insertId;
  },

  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM club");
    return rows;
  },

  getBySecretKey: async (secret_key) => {
    const [rows] = await db.query("SELECT * FROM club WHERE secret_key = ?", [secret_key]);
    return rows[0];
  },
  update: async (clubId, data) => {
    const { name, description, secret_key, tagline, category, activities, club_head_id } = data;
    const [result] = await db.query(
      `UPDATE club 
     SET name = ?, description = ?, secret_key = ?, tagline = ?, category = ?, activities = ?, club_head_id = ?
     WHERE club_id = ?`,
      [name, description, secret_key, tagline, category, activities, club_head_id, clubId]
    );
    return result;
  },

};

