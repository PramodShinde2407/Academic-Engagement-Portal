import { db } from "../config/db.js";


export const ClubModel = {
  create: async ({ name, description, club_head_id, club_mentor_id, secret_key, permission_emails, club_mentor_key }) => {
    const [res] = await db.query(
      "INSERT INTO club (name, description, club_head_id, club_mentor_id, secret_key, permission_emails, club_mentor_key) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [name, description, club_head_id, club_mentor_id, secret_key, permission_emails || null, club_mentor_key || null]
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

  getByMentorKey: async (club_mentor_key) => {
    const [rows] = await db.query("SELECT * FROM club WHERE club_mentor_key = ?", [club_mentor_key]);
    return rows[0];
  },
  update: async (clubId, data) => {
    const { name, description, secret_key, tagline, category, activities, club_head_id, club_mentor_id, permission_emails } = data;
    const [result] = await db.query(
      `UPDATE club 
     SET name = ?, description = ?, secret_key = ?, tagline = ?, category = ?, activities = ?, club_head_id = ?, club_mentor_id = ?, permission_emails = ?
     WHERE club_id = ?`,
      [name, description, secret_key, tagline, category, activities, club_head_id, club_mentor_id, permission_emails || null, clubId]
    );
    return result;
  },

  getById: async (clubId) => {
    const [rows] = await db.query("SELECT * FROM club WHERE club_id = ?", [clubId]);
    return rows[0];
  },

  updateRegistrationStatus: async (clubId, is_registration_open) => {
    const [result] = await db.query(
      `UPDATE club SET is_registration_open = ? WHERE club_id = ?`,
      [is_registration_open, clubId]
    );
    return result;
  }

};
