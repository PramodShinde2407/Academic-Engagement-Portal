import { db } from "../config/db.js";  // ✅ make sure this exists

export const EventRegistrationModel = {
  // Register a user for an event
  async register(eventId, userId) {
    await db.query(
      "INSERT INTO event_registration (event_id, student_id) VALUES (?, ?)",
      [eventId, userId]
    );
  },

  // Fetch all events the user has registered for
  async myEvents(userId) {
    const [rows] = await db.query(`
      SELECT 
        e.event_id,
        e.title,
        e.description,
        e.date,
        e.venue,
        e.status
      FROM event_registration er
      LEFT JOIN event e ON er.event_id = e.event_id
      WHERE er.student_id = ?
      ORDER BY e.date ASC
    `, [userId]);

    return rows;
  }
};
