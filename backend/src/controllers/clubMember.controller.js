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
    const [clubs] = await db.query(`
      SELECT c.* 
      FROM club_member cm
      JOIN club c ON cm.club_id = c.club_id
      WHERE cm.student_id = ?
    `, [userId]);

    res.json(clubs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user clubs" });
  }
};
