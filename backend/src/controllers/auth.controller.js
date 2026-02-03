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
    if (role[0].role_name === "Club Head") {
      const club = await ClubModel.getBySecretKey(secret_key);
      if (!club || club.club_head_id) {
        return res.status(400).json({ message: "Invalid or used Club Key" });
      }

      // will assign club_head_id after user creation
    }

    // === Teacher Key validation ===
    if (role[0].role_name === "Teacher") {
      const [teacherKeyRow] = await db.query(
        "SELECT * FROM teacher_key WHERE key_value = ?",
        [secret_key]
      );
      if (!teacherKeyRow.length) {
        return res.status(400).json({ message: "Invalid Teacher Key" });
      }
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
    }

    res.json({ message: "Registered successfully" });
  } catch (err) {
    next(err);
  }
};



export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({
      id: user.user_id,
      role_id: user.role_id
    });

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
        role_name: user.role_name
      }
    });
  } catch (err) {
    next(err);
  }
};

