import { db } from "../config/db.js"; // <-- add this import at top
import { ClubMemberModel } from "../models/clubMember.model.js";

export const joinClub = async (req, res, next) => {
  try {
    await ClubMemberModel.join(req.body.club_id, req.user.id);
    res.json({ message: "Joined club" });
  } catch (err) {
    next(err);
  }
};

export const leaveClub = async (req, res, next) => {
  try {
    await ClubMemberModel.leave(req.body.club_id, req.user.id);
    res.json({ message: "Left club" });
  } catch (err) {
    next(err);
  }
};

export const myClubs = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role_name;

    // For students, only show clubs where they are enrolled members
    // For other roles (Club Head, Club Mentor), show all related clubs
    let query;
    let params;

    if (userRole === 'Student') {
      // Students: only show clubs where they are members (not head/mentor)
      query = `
        SELECT DISTINCT 
          c.*,
          mentor.name as mentor_name,
          mentor.email as mentor_email,
          head.name as head_name,
          head.email as head_email
        FROM club c
        INNER JOIN club_member cm ON cm.club_id = c.club_id
        LEFT JOIN user mentor ON c.club_mentor_id = mentor.user_id
        LEFT JOIN user head ON c.club_head_id = head.user_id
        WHERE cm.user_id = ?
      `;
      params = [userId];
    } else {
      // Other roles: show all clubs they're associated with
      query = `
        SELECT DISTINCT 
          c.*,
          mentor.name as mentor_name,
          mentor.email as mentor_email,
          head.name as head_name,
          head.email as head_email
        FROM club c
        LEFT JOIN club_member cm ON cm.club_id = c.club_id AND cm.user_id = ?
        LEFT JOIN user mentor ON c.club_mentor_id = mentor.user_id
        LEFT JOIN user head ON c.club_head_id = head.user_id
        WHERE cm.user_id = ? OR c.club_head_id = ? OR c.club_mentor_id = ?
      `;
      params = [userId, userId, userId, userId];
    }

    const [clubs] = await db.query(query, params);
    res.json(clubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user clubs" });
  }
};
