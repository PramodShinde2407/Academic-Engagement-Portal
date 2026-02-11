import { EventRegistrationModel } from "../models/eventRegistration.model.js";
import { EventModel } from "../models/event.model.js";
import { ClubModel } from "../models/club.model.js";
import { NotificationModel } from "../models/notification.model.js";

export const registerEvent = async (req, res, next) => {
  try {
    const { event_id, ...formData } = req.body;
    const user_id = req.user.id;

    await EventRegistrationModel.register(event_id, user_id, formData);

    // Notification Logic
    const event = await EventModel.getById(event_id);
    if (event && event.club_id) {
      const club = await ClubModel.getById(event.club_id);
      if (club) {
        const recipients = [club.club_head_id];
        if (club.club_mentor_id) {
          recipients.push(club.club_mentor_id);
        }

        for (const recipientId of recipients) {
          await NotificationModel.createNotification({
            user_id: recipientId,
            title: 'New Event Registration',
            message: `${formData.full_name || 'A student'} has registered for ${event.title}`,
            type: 'info',
            link: `/events/${event_id}` // Adjust link as needed
          });
        }
      }
    }

    res.json({ message: "Event registered successfully" });
  } catch (err) {
    next(err);
  }
};

export const myRegistrations = async (req, res, next) => {
  try {
    res.json(await EventRegistrationModel.myEvents(req.user.id, req.user.role_name));
  } catch (err) {
    next(err);
  }
};

