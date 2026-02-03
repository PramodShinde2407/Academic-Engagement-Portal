import jwt from "jsonwebtoken";
import { env } from "../config/env.js";


export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    // ✅ IMPORTANT: normalize payload
    req.user = {
      id: decoded.id,
      role: Number(decoded.role_id) // ensure number, not string
    };
    console.log("AUTH USER:", req.user);

    // 🔍 TEMP DEBUG (REMOVE AFTER TESTING)
    console.log("AUTH USER:", req.user);

    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};
