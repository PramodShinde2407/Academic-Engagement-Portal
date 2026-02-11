import { db } from "../config/db.js";

export const createEvent = async (req, res) => {
  const { title, description, date, venue, club_id, additional_info, conducted_by } = req.body;

  await db.query(
    "INSERT INTO event (title, description, date, venue, status, club_id, organizer_id, additional_info, conducted_by) VALUES (?,?,?,?,?,?,?,?,?)",
    [title, description, date, venue, "PENDING", club_id, req.user.id, additional_info, conducted_by]
  );

  res.status(201).json({ message: "Event created, awaiting approval" });
};


export const getEvents = async (req, res) => {
  const [events] = await db.query("SELECT * FROM event");
  res.json(events);
};

export const getEventById = async (req, res) => {
  const { eventId } = req.params;

  const [rows] = await db.query(
    `SELECT 
        e.*,
        u.name AS creator_name
     FROM event e
     JOIN user u ON u.user_id = e.organizer_id
     WHERE e.event_id = ?`,
    [eventId]
  );

  if (rows.length === 0) return res.status(404).json({ message: "Event not found" });

  res.json(rows[0]); // this will now include additional_info & conducted_by
};



export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  const [[event]] = await db.query(
    "SELECT organizer_id FROM event WHERE event_id = ?",
    [eventId]
  );

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // 🔐 AUTH CHECK
  if (event.organizer_id !== req.user.id && req.user.role !== 4) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await db.query("DELETE FROM event WHERE event_id = ?", [eventId]);

  res.json({ message: "Event deleted successfully" });
};
export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { title, description, date, venue, additional_info, conducted_by } = req.body;

  const [[event]] = await db.query(
    "SELECT organizer_id FROM event WHERE event_id = ?",
    [eventId]
  );

  if (!event) return res.status(404).json({ message: "Event not found" });
  if (event.organizer_id !== req.user.id && req.user.role !== 4) return res.status(403).json({ message: "Not allowed" });

  await db.query(
    `UPDATE event 
     SET title=?, description=?, date=?, venue=?, additional_info=?, conducted_by=?
     WHERE event_id=?`,
    [title, description, date, venue, additional_info, conducted_by, eventId]
  );

  res.json({ message: "Event updated" });
};
