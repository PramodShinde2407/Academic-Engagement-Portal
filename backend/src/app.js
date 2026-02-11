import express from "express";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import clubRoutes from "./routes/club.routes.js";
import eventRoutes from "./routes/event.routes.js";
import approvalRoutes from "./routes/approval.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import clubMemberRoutes from "./routes/clubMember.routes.js";

import eventRegistrationRoutes from "./routes/eventRegistration.routes.js"
import volunteerRoutes from "./routes/volunteer.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import clubRegistrationRoutes from "./routes/clubRegistration.routes.js";
import clubInterestRoutes from "./routes/clubInterest.routes.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

/* 🔥 BODY PARSERS — BOTH REQUIRED */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

/* Serve static files (uploaded photos) */
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* Health check */
app.get("/", (req, res) => {
  res.json({ status: "Backend running" });
});

/* Routes */
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/approvals", approvalRoutes);
app.use("/api/club-members", clubMemberRoutes);
app.use("/api/event-registrations", eventRegistrationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/club-registrations", clubRegistrationRoutes);
app.use("/api/club-interest", clubInterestRoutes);


/* Error handler */
app.use(errorHandler);

export default app;
