import { EventRegistrationModel } from "../models/eventRegistration.model.js";
import { EventModel } from "../models/event.model.js";
import { ClubModel } from "../models/club.model.js";
import { NotificationModel } from "../models/notification.model.js";

export const registerEvent = async (req, res, next) => {
  try {
    const { event_id, ...formData } = req.body;
    const user_id = req.user.id;

    console.log(`\n🔔 REGISTRATION ATTEMPT: user_id=${user_id}, event_id=${event_id}, name=${formData.full_name}`);

    // ✅ PRE-CHECK: Prevent duplicate registration with a clear message
    const alreadyRegistered = await EventRegistrationModel.isAlreadyRegistered(event_id, user_id);
    if (alreadyRegistered) {
      console.log(`⚠️  DUPLICATE: user_id=${user_id} already registered for event_id=${event_id}`);
      return res.status(409).json({ message: "You are already registered for this event." });
    }

    await EventRegistrationModel.register(event_id, user_id, formData);

    // Notification Logic
    // Notification Logic
    // Notification Logic
    const event = await EventModel.getById(event_id);
    console.log("DEBUG: Event fetched for notification:", event);

    if (event && event.club_id) {
      const club = await ClubModel.getById(event.club_id);
      console.log("DEBUG: Club fetched for notification:", club);

      if (club) {
        // Strict targeting: Only Club Head and Club Mentor of this specific club
        const recipients = [];
        if (club.club_head_id) recipients.push(club.club_head_id);
        if (club.club_mentor_id) recipients.push(club.club_mentor_id);

        console.log(`DEBUG: Notification recipients identified: ${JSON.stringify(recipients)}`);

        if (recipients.length === 0) {
          console.warn(`WARNING: No Club Head or Mentor found for Club ID ${event.club_id}. Notifications will NOT be sent.`);
        }

        for (const recipientId of recipients) {
          try {
            await NotificationModel.createNotification({
              user_id: recipientId,
              title: 'New Event Registration',
              message: `${formData.full_name || 'A student'} has registered for ${event.title}`,
              type: 'info',
              link: `/events/${event_id}`
            });
            console.log(`DEBUG: Notification successfully queued for User ID ${recipientId}`);
          } catch (notifErr) {
            console.error(`ERROR: Failed to create notification for User ID ${recipientId}`, notifErr);
          }
        }
      } else {
        console.warn(`WARNING: Club ID ${event.club_id} not found in database. Cannot send notifications.`);
      }
    } else {
      console.warn(`WARNING: Event ${event_id} has no associated 'club_id'. No club notifications will be sent.`);
    }

    res.json({ message: "Event registration confirmed and approved automatically." });
  } catch (err) {
    next(err);
  }
};

export const myRegistrations = async (req, res, next) => {
  try {
    // req.user.role is the numeric role_id set by authenticate middleware
    res.json(await EventRegistrationModel.myEvents(req.user.id, req.user.role));
  } catch (err) {
    next(err);
  }
};

export const getEventAttendees = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role; // e.g. 2 for Club Head, 4 for Admin, 5 for Mentor

    // 1. Get Event
    const event = await EventModel.getById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2. Check Permissions
    if (userRole === 4) { // Admin
      // Allowed
    } else {
      // Must be associated with the club
      const club = await ClubModel.getById(event.club_id);
      if (!club) return res.status(404).json({ message: "Club not found" });

      const isClubHead = club.club_head_id === userId;
      const isClubMentor = club.club_mentor_id === userId;

      if (!isClubHead && !isClubMentor) {
        return res.status(403).json({ message: "Access denied. Only Club Head or Mentor can view attendees." });
      }
    }

    // 3. Fetch Attendees
    const attendees = await EventRegistrationModel.getAttendees(eventId);
    res.json(attendees);

  } catch (err) {
    next(err);
  }
};
