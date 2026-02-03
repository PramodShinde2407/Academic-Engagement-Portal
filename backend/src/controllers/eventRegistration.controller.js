import { EventRegistrationModel } from "../models/eventRegistration.model.js";

export const registerEvent = async (req, res, next) => {
  try {
    await EventRegistrationModel.register(req.body.event_id, req.user.id);
    res.json({ message: "Event registered" });
  } catch (err) {
    next(err);
  }
};

export const myRegistrations = async (req, res, next) => {
  try {
    res.json(await EventRegistrationModel.myEvents(req.user.id));
  } catch (err) {
    next(err);
  }
};

