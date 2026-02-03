import { db } from "../config/db.js";

export const AuditModel = {
  log: async ({ user_id, action, entity_type, entity_id }) => {
    await db.query(
      `INSERT INTO audit_log (user_id,action,entity_type,entity_id)
       VALUES (?,?,?,?)`,
      [user_id, action, entity_type, entity_id]
    );
  }
};
