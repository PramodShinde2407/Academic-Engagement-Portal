import express from "express";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import clubRoutes from "./routes/club.routes.js";
import eventRoutes from "./routes/event.routes.js";
import approvalRoutes from "./routes/approval.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import clubMemberRoutes from "./routes/clubMember.routes.js";

import eventRegistrationRoutes from"./routes/eventRegistration.routes.js"
import volunteerRoutes from "./routes/volunteer.routes.js";
import cors from "cors";


const app = express();

/* 🔥 BODY PARSERS — BOTH REQUIRED */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));

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


/* Error handler */
app.use(errorHandler);

export default app;
