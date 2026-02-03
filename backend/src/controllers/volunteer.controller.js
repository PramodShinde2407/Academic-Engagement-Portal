import { VolunteerModel } from "../models/volunteer.model.js";

export const volunteerEvent = async (req, res, next) => {
  try {
    await VolunteerModel.add({
      event_id: req.body.event_id,
      student_id: req.user.id,
      task: req.body.task
    });
    res.json({ message: "Volunteer added" });
  } catch (err) {
    next(err);
  }
};
