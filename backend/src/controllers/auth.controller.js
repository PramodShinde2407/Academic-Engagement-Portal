import { db } from "../config/db.js";

import { UserModel } from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { signToken } from "../utils/jwt.js";
import { ClubModel } from "../models/club.model.js";



// In register controller
export const register = async (req, res, next) => {
  try {
    const { name, email, password, department, year, role_id, secret_key } = req.body;

    // Fetch role
    const [role] = await db.query("SELECT * FROM role WHERE role_id = ?", [role_id]);
    if (!role.length) return res.status(400).json({ message: "Invalid role" });

    // === Admin Key validation ===
    if (role[0].role_name === "Admin") {
      const [adminKeyRow] = await db.query("SELECT * FROM admin_key WHERE key_value = ? AND used = 0", [secret_key]);
      if (!adminKeyRow.length) return res.status(400).json({ message: "Invalid Admin Key" });

      // mark key used
      await db.query("UPDATE admin_key SET used = 1 WHERE key_value = ?", [secret_key]);
    }

    // === Club Head key validation ===
    else if (role[0].role_name === "Club Head") {
      const club = await ClubModel.getBySecretKey(secret_key);
      if (!club || club.club_head_id) {
        return res.status(400).json({ message: "Invalid or used Club Key" });
      }

      // will assign club_head_id after user creation
    }

    // === Faculty Key validation ===
    else if (role[0].role_name === "Faculty") {
      const [facultyKeyRow] = await db.query(
        "SELECT * FROM faculty_key WHERE key_value = ?",
        [secret_key]
      );
      if (!facultyKeyRow.length) {
        return res.status(400).json({ message: "Invalid Faculty Key" });
      }
    }


    // === Club Mentor Key validation ===
    else if (role[0].role_name === "Club Mentor") {
      const club = await ClubModel.getByMentorKey(secret_key);
      if (!club) {
        return res.status(400).json({ message: "Invalid Club Mentor Key" });
      }
      if (club.club_mentor_id) {
        return res.status(400).json({ message: "This Club Mentor Key has already been used" });
      }
    }

    // === Estate Manager Key validation ===
    else if (role[0].role_name === "Estate Manager") {
      const [estateKeyRow] = await db.query(
        "SELECT * FROM estate_manager_key WHERE key_value = ?",
        [secret_key]
      );
      if (!estateKeyRow.length) {
        return res.status(400).json({ message: "Invalid Estate Manager Key" });
      }
    }

    // === Principal Key validation (one-time use) ===
    else if (role[0].role_name === "Principal") {
      const [principalKeyRow] = await db.query(
        "SELECT * FROM principal_key WHERE key_value = ? AND used = 0",
        [secret_key]
      );
      if (!principalKeyRow.length) {
        return res.status(400).json({ message: "Invalid or used Principal Key" });
      }
      // mark key used
      await db.query("UPDATE principal_key SET used = 1 WHERE key_value = ?", [secret_key]);
    }

    // === Director Key validation (one-time use) ===
    else if (role[0].role_name === "Director") {
      const [directorKeyRow] = await db.query(
        "SELECT * FROM director_key WHERE key_value = ? AND used = 0",
        [secret_key]
      );
      if (!directorKeyRow.length) {
        return res.status(400).json({ message: "Invalid or used Director Key" });
      }
      // mark key used
      await db.query("UPDATE director_key SET used = 1 WHERE key_value = ?", [secret_key]);
    }



    // Hash password
    const hashed = await hashPassword(password);

    const [result] = await db.query(
      "INSERT INTO user (name,email,password_hash,department,year,role_id) VALUES (?,?,?,?,?,?)",
      [name, email, hashed, department, year, role_id]
    );

    const userId = result.insertId;

    // assign club_head_id if Club Head
    if (role[0].role_name === "Club Head") {
      await db.query("UPDATE club SET club_head_id = ? WHERE secret_key = ?", [userId, secret_key]);

      // Auto-join as member
      const [clubRow] = await db.query("SELECT club_id FROM club WHERE secret_key = ?", [secret_key]);
      if (clubRow.length) {
        await db.query(
          "INSERT INTO club_member (club_id, user_id, student_name, email, year, branch) VALUES (?, ?, ?, ?, ?, ?)",
          [clubRow[0].club_id, userId, name, email, year, department]
        );
      }
    }

    // assign club_mentor_id if Club Mentor
    if (role[0].role_name === "Club Mentor") {
      await db.query("UPDATE club SET club_mentor_id = ? WHERE club_mentor_key = ?", [userId, secret_key]);

      // Auto-join as member
      const [clubRow] = await db.query("SELECT club_id FROM club WHERE club_mentor_key = ?", [secret_key]);
      if (clubRow.length) {
        await db.query(
          "INSERT INTO club_member (club_id, user_id, student_name, email, year, branch) VALUES (?, ?, ?, ?, ?, ?)",
          [clubRow[0].club_id, userId, name, email, year, department]
        );
      }
    }

    res.json({ message: "Registered successfully" });
  } catch (err) {
    next(err);
  }
};



export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    const user = await UserModel.findByEmail(email);
    if (!user) {
      console.log(`User not found: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      console.log(`Password mismatch for: ${email}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log(`Login successful for: ${email} | Role: ${user.role_name}`);

    const token = signToken({
      id: user.user_id,
      role_id: user.role_id
    });

    // 🔹 Fetch club_id for Club Head (role 2) and Club Mentor (role 5)
    let club_id = null;
    if (user.role_id === 2) {
      const [[headClub]] = await db.query("SELECT club_id FROM club WHERE club_head_id = ?", [user.user_id]);
      if (headClub) club_id = headClub.club_id;
    } else if (user.role_id === 5) {
      const [[mentorClub]] = await db.query("SELECT club_id FROM club WHERE club_mentor_id = ?", [user.user_id]);
      if (mentorClub) club_id = mentorClub.club_id;
    }

    // ✅ SEND USER DATA TO FRONTEND
    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        role_id: user.role_id,
        role_name: user.role_name,
        club_id  // 🔹 included so frontend can check club ownership
      }
    });
  } catch (err) {
    next(err);
  }
};


