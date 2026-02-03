import { db } from "../config/db.js";

export const EventModel = {
  create: async (data) => {
    const { title, description, date, venue, club_id, organizer_id } = data;
    const [res] = await db.query(
      `INSERT INTO event
       (title,description,date,venue,status,club_id,organizer_id)
       VALUES (?,?,?,?,?,?,?)`,
      [title, description, date, venue, "PENDING", club_id, organizer_id]
    );
    return res.insertId;
  },

  getAll: async () => {
    const [rows] = await db.query("SELECT * FROM event");
    return rows;
  }
};
