import jwt from "jsonwebtoken";
import { env } from "../config/env.js";


export const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log('❌ Auth failed: No authorization header or invalid format');
    return res.status(401).json({ message: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    console.log('✅ Token verified for user:', decoded.id, 'role:', decoded.role_id);

    // ✅ IMPORTANT: normalize payload
    req.user = {
      id: decoded.id,
      role: Number(decoded.role_id) // ensure number, not string
    };

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.log('❌ Auth failed: Token expired');
      return res.status(403).json({ message: "Token expired - Please log in again" });
    } else if (err.name === 'JsonWebTokenError') {
      console.log('❌ Auth failed: Invalid token -', err.message);
      return res.status(403).json({ message: "Invalid token - Please log in again" });
    } else {
      console.log('❌ Auth failed: Unknown error -', err.message);
      return res.status(403).json({ message: "Authentication failed" });
    }
  }
};
