import { db } from "../config/db.js";

export const VolunteerModel = {
  add: async ({ event_id, student_id, task }) => {
    await db.query(
      `INSERT INTO volunteer (event_id, student_id, task)
       VALUES (?, ?, ?)`,
      [event_id, student_id, task]
    );
  }
};
