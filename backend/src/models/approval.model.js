import { db } from "../config/db.js";

export const ApprovalModel = {
  create: async ({ event_id, authority_id, status, remarks }) => {
    await db.query(
      `INSERT INTO approval
       (event_id,authority_id,status,remarks,action_date)
       VALUES (?,?,?,?,NOW())`,
      [event_id, authority_id, status, remarks]
    );

    await db.query(
      "UPDATE event SET status=? WHERE event_id=?",
      [status, event_id]
    );
  }
};
