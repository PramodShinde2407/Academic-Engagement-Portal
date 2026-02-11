import { db } from "../config/db.js";  // ✅ make sure this exists

export const EventRegistrationModel = {
  // Register a user for an event
  async register(eventId, userId, formData) {
    const { full_name, email, phone, department, year, roll_no, notes } = formData;
    await db.query(
      "INSERT INTO event_registration (event_id, student_id, full_name, email, phone, department, year, roll_no, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [eventId, userId, full_name, email, phone, department, year, roll_no, notes]
    );
  },

  // Fetch all events the user has registered for
  async myEvents(userId, userRole) {
    let query;
    let params;

    if (userRole === 'Student') {
      // Students: only show events they've registered for
      query = `
        SELECT DISTINCT
          e.*
        FROM event e
        INNER JOIN event_registration er ON er.event_id = e.event_id
        WHERE er.student_id = ?
        ORDER BY e.date ASC
      `;
      params = [userId];
    } else {
      // Other roles: show all events they're associated with
      query = `
        SELECT DISTINCT
          e.*
        FROM event e
        LEFT JOIN event_registration er ON er.event_id = e.event_id AND er.student_id = ?
        LEFT JOIN club c ON c.club_id = e.club_id
        WHERE er.student_id = ? 
           OR e.organizer_id = ? 
           OR c.club_head_id = ? 
           OR c.club_mentor_id = ?
        ORDER BY e.date ASC
      `;
      params = [userId, userId, userId, userId, userId];
    }

    const [rows] = await db.query(query, params);
    return rows;
  }
};
