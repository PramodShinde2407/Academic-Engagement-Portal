import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { createEvent, getEvents, getEventById, deleteEvent, updateEvent } from "../controllers/event.controller.js";

const router = express.Router();

// CREATE EVENT – only logged in users
router.post("/", authenticate, createEvent);

// GET ALL EVENTS – public
router.get("/", getEvents);

// GET ONE EVENT – public
router.get("/:eventId", getEventById);

// UPDATE EVENT – only creator
router.put("/:eventId", authenticate, updateEvent);

// DELETE EVENT – only creator
router.delete("/:eventId", authenticate, deleteEvent);

export default router;
