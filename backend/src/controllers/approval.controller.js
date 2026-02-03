import { db } from "../config/db.js";

export const approveEvent = async (req, res) => {
  const { event_id, status, remarks } = req.body;

  await db.query(
    "INSERT INTO approval (event_id,authority_id,status,remarks,action_date) VALUES (?,?,?,?,NOW())",
    [event_id, req.user.id, status, remarks]
  );

  await db.query(
    "UPDATE event SET status=? WHERE event_id=?",
    [status, event_id]
  );

  res.json({ message: "Event status updated" });
};
