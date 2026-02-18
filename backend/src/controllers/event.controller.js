import { db } from "../config/db.js";

export const createEvent = async (req, res) => {
  let { title, description, date, venue, club_id, additional_info, conducted_by } = req.body;

  // Allow Club Head (2), Club Mentor (5), and Admin (4)
  const allowedRoles = [2, 4, 5];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "Only Club Heads, Mentors, and Admins can create events" });
  }

  // 🔹 AUTOMATICALLY INFER CLUB ID if not provided 🔹
  if (!club_id) {
    if (req.user.role === 2) { // Club Head
      const [[headClub]] = await db.query("SELECT club_id FROM club WHERE club_head_id = ?", [req.user.id]);
      if (headClub) club_id = headClub.club_id;
    } else if (req.user.role === 5) { // Club Mentor
      const [[mentorClub]] = await db.query("SELECT club_id FROM club WHERE club_mentor_id = ?", [req.user.id]);
      if (mentorClub) club_id = mentorClub.club_id;
    }
  }

  // Set status to APPROVED as permission is no longer needed
  await db.query(
    "INSERT INTO event (title, description, date, venue, status, club_id, organizer_id, additional_info, conducted_by) VALUES (?,?,?,?,?,?,?,?,?)",
    [title, description, date, venue, "APPROVED", club_id || null, req.user.id, additional_info, conducted_by]
  );

  res.status(201).json({ message: "Event created successfully" });
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
        u.name AS creator_name,
        c.club_head_id,
        c.club_mentor_id
     FROM event e
     JOIN user u ON u.user_id = e.organizer_id
     LEFT JOIN club c ON c.club_id = e.club_id
     WHERE e.event_id = ?`,
    [eventId]
  );

  if (rows.length === 0) return res.status(404).json({ message: "Event not found" });

  res.json(rows[0]); // this will now include additional_info & conducted_by
};



export const deleteEvent = async (req, res) => {
  const { eventId } = req.params;

  const [[event]] = await db.query(
    "SELECT * FROM event WHERE event_id = ?",
    [eventId]
  );

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  // 🔐 SHARED ACCESS CHECK
  const [[club]] = await db.query("SELECT club_head_id, club_mentor_id FROM club WHERE club_id = ?", [event.club_id]);

  let isAuthorized = false;
  if (req.user.role === 4) { // Admin
    isAuthorized = true;
  } else if (club) {
    if (club.club_head_id === req.user.id || club.club_mentor_id === req.user.id) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return res.status(403).json({ message: "Not allowed" });
  }

  await db.query("DELETE FROM event WHERE event_id = ?", [eventId]);

  res.json({ message: "Event deleted successfully" });
};
export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  const { title, description, date, venue, additional_info, conducted_by } = req.body;

  const [[event]] = await db.query(
    "SELECT * FROM event WHERE event_id = ?",
    [eventId]
  );

  if (!event) return res.status(404).json({ message: "Event not found" });

  // 🔐 SHARED ACCESS CHECK: Allow Club Head AND Mentor of the SAME club
  // Get club details
  const [[club]] = await db.query("SELECT club_head_id, club_mentor_id FROM club WHERE club_id = ?", [event.club_id]);

  let isAuthorized = false;
  if (req.user.role === 4) { // Admin
    isAuthorized = true;
  } else if (club) {
    if (club.club_head_id === req.user.id || club.club_mentor_id === req.user.id) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return res.status(403).json({ message: "Not allowed. Only Club Head or Mentor of this club can edit." });
  }

  await db.query(
    `UPDATE event 
     SET title=?, description=?, date=?, venue=?, additional_info=?, conducted_by=?
     WHERE event_id=?`,
    [title, description, date, venue, additional_info, conducted_by, eventId]
  );

  res.json({ message: "Event updated" });
};
