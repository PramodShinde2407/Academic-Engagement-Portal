import { ClubModel } from "../models/club.model.js";
import { db } from "../config/db.js";

// Create a new club
export const createClub = async (req, res, next) => {
  try {
    // only Admin
    if (req.user.role !== 4) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const { name, description, secretKey, permissionEmails, clubMentorKey } = req.body;

    if (!name || !description || !secretKey) {
      return res.status(400).json({ message: "All fields required" });
    }

    const clubId = await ClubModel.create({
      name,
      description,
      club_head_id: null,
      club_mentor_id: null,
      secret_key: secretKey, // ✅ ADMIN-PROVIDED KEY for Club Head
      permission_emails: permissionEmails || null,
      club_mentor_key: clubMentorKey || null // ✅ KEY for Club Mentor
    });

    res.status(201).json({
      message: "Club created successfully",
      clubId
    });
  } catch (err) {
    next(err);
  }
};


// Get all clubs
export const getAllClubs = async (req, res, next) => {
  try {
    const [clubs] = await db.query(`
      SELECT 
        c.*,
        mentor.name as mentor_name,
        mentor.email as mentor_email,
        head.name as head_name,
        head.email as head_email,
        COALESCE(COUNT(DISTINCT ca.application_id), 0) + 1 as active_members
      FROM club c
      LEFT JOIN user mentor ON c.club_mentor_id = mentor.user_id
      LEFT JOIN user head ON c.club_head_id = head.user_id
      LEFT JOIN club_application ca ON c.club_id = ca.club_id AND ca.status = 'approved'
      GROUP BY c.club_id
    `);

    res.json(clubs);
  } catch (err) {
    next(err);
  }
};

// Get club by ID
export const getClubById = async (req, res, next) => {
  try {
    const clubId = req.params.id;
    const [rows] = await db.query(
      `SELECT 
          c.*,
          mentor.name as mentor_name,
          mentor.email as mentor_email,
          head.name as head_name,
          head.email as head_email
       FROM club c
       LEFT JOIN user mentor ON c.club_mentor_id = mentor.user_id
       LEFT JOIN user head ON c.club_head_id = head.user_id
       WHERE c.club_id = ?`,
      [clubId]
    );



    if (rows.length === 0) return res.status(404).json({ message: "Club not found" });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};


export const updateClub = async (req, res, next) => {
  try {
    const clubId = req.params.id;
    const { name, description, secret_key, tagline, category, activities, club_head_id } = req.body;

    // fetch the club first
    const [rows] = await db.query("SELECT * FROM club WHERE club_id = ?", [clubId]);
    if (rows.length === 0) return res.status(404).json({ message: "Club not found" });

    const club = rows[0];

    // Permission check: Admin (4), Club Head, or Club Mentor
    if (req.user.role !== 4 && req.user.id !== club.club_head_id && req.user.id !== club.club_mentor_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // update the club in DB
    await ClubModel.update(clubId, { name, description, secret_key, tagline, category, activities, club_head_id });

    res.json({ message: "Club updated successfully" });
  } catch (err) {
    next(err);
  }
};
export const deleteClub = async (req, res, next) => {
  try {
    const clubId = req.params.id;

    // fetch club
    const [rows] = await db.query(
      "SELECT club_head_id FROM club WHERE club_id = ?",
      [clubId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Club not found" });
    }

    const club = rows[0];

    // ✅ ADMIN OR CLUB HEAD
    const isAdmin = req.user.role === 4;
    const isClubHead = req.user.id === club.club_head_id;

    if (!isAdmin && !isClubHead) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // delete members first (FK safety)
    await db.query("DELETE FROM club_member WHERE club_id = ?", [clubId]);

    // delete club
    await db.query("DELETE FROM club WHERE club_id = ?", [clubId]);

    res.json({ message: "Club deleted successfully" });
  } catch (err) {
    next(err);
  }
};
export const addStudentToClub = async (req, res, next) => {
  try {
    const clubId = req.params.clubId;
    const { name, email, roll_no, year, branch } = req.body;

    // Check if user exists in the system
    const [users] = await db.query(
      "SELECT user_id FROM user WHERE email = ?",
      [email]
    );

    let studentId = null;

    if (users.length) {
      studentId = users[0].user_id;
    } else {
      // Optional: Insert a manual student into a students table if needed
      // const [result] = await db.query(
      //   "INSERT INTO students (name, email, roll_no, year, branch) VALUES (?, ?, ?, ?, ?)",
      //   [name, email, roll_no, year, branch]
      // );
      // studentId = result.insertId;
    }

    // Check if student is already in the club
    const [exists] = await db.query(
      "SELECT id FROM club_member WHERE club_id = ? AND user_id = ?",
      [clubId, studentId]
    );

    if (exists.length) {
      return res.status(400).json({ message: "Student already added" });
    }

    // Insert student into club_member
    await db.query(
      "INSERT INTO club_member (club_id, user_id, student_name, email, roll_no, year, branch) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [clubId, studentId, name, email, roll_no, year, branch]
    );

    res.json({ message: "Student added successfully" });
  } catch (err) {
    next(err);
  }
};

export const removeStudentFromClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Student email required" });
    }

    // Fetch club
    const [clubs] = await db.query(
      "SELECT club_head_id FROM club WHERE club_id = ?",
      [clubId]
    );

    if (!clubs.length) {
      return res.status(404).json({ message: "Club not found" });
    }

    const club = clubs[0];

    // ✅ PERMISSION CHECK
    const isAdmin = req.user.role === 4;
    const isClubHead = req.user.id === club.club_head_id;

    if (!isAdmin && !isClubHead) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Check student exists
    const [members] = await db.query(
      "SELECT * FROM club_member WHERE club_id = ? AND email = ?",
      [clubId, email]
    );

    if (!members.length) {
      return res.status(404).json({ message: "Student not found in this club" });
    }

    // Remove student
    await db.query(
      "DELETE FROM club_member WHERE club_id = ? AND email = ?",
      [clubId, email]
    );

    res.json({ message: "Student removed successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getClubMembers = async (req, res) => {
  try {
    const { clubId } = req.params;

    const [members] = await db.query(
      `SELECT user_id, student_name, email, roll_no, year, branch
       FROM club_member
       WHERE club_id = ?`,
      [clubId]
    );

    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch members" });
  }
};

// Toggle club registration status
export const toggleRegistration = async (req, res, next) => {
  try {
    const { clubId } = req.params;
    const { is_registration_open } = req.body;

    // Check if user is club head
    const [clubs] = await db.query(
      "SELECT club_head_id FROM club WHERE club_id = ?",
      [clubId]
    );

    if (!clubs.length) {
      return res.status(404).json({ message: "Club not found" });
    }

    const club = clubs[0];

    if (req.user.role !== 4 && req.user.id !== club.club_head_id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Update registration status
    await ClubModel.updateRegistrationStatus(clubId, is_registration_open);

    // If opening registration, notify interested users
    if (is_registration_open) {
      const { notifyInterestedUsers } = await import('./clubInterest.controller.js');
      await notifyInterestedUsers(clubId);
    }

    res.json({
      message: `Registration ${is_registration_open ? 'opened' : 'closed'} successfully`
    });
  } catch (err) {
    next(err);
  }
};
