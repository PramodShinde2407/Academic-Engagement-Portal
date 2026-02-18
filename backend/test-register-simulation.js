
import { db } from "./src/config/db.js";
import { NotificationModel } from "./src/models/notification.model.js";
import { ClubModel } from "./src/models/club.model.js";
import { EventModel } from "./src/models/event.model.js";

async function simulateRegistration(eventId, userId, formData) {
    try {
        console.log(`Simulating registration for Event ID: ${eventId} by User ID: ${userId}`);

        // Simulation of controller logic
        const event = await EventModel.getById(eventId);
        console.log("Event fetched:", event);

        if (event && event.club_id) {
            const club = await ClubModel.getById(event.club_id);
            console.log("Club fetched:", club);

            if (club) {
                // Strict targeting: Only Club Head and Club Mentor of this specific club
                const recipients = [];
                if (club.club_head_id) recipients.push(club.club_head_id);
                if (club.club_mentor_id) recipients.push(club.club_mentor_id);

                console.log(`Recipients identified: ${JSON.stringify(recipients)}`);

                if (recipients.length === 0) {
                    console.warn(`WARNING: No Club Head or Mentor found for Club ID ${event.club_id}.`);
                }

                for (const recipientId of recipients) {
                    try {
                        console.log(`Attempting to notify User ID ${recipientId}...`);
                        const notifId = await NotificationModel.createNotification({
                            user_id: recipientId,
                            title: 'New Event Registration',
                            message: `${formData.full_name || 'A student'} has registered for ${event.title}`,
                            type: 'info',
                            link: `/clubs/${event.club_id}`
                        });
                        console.log(`SUCCESS: Notification created with ID ${notifId} for User ID ${recipientId}`);
                    } catch (notifErr) {
                        console.error(`ERROR: Failed to create notification for User ID ${recipientId}`, notifErr);
                    }
                }
            } else {
                console.warn(`WARNING: Club ID ${event.club_id} not found.`);
            }
        } else {
            console.warn(`WARNING: Event ${eventId} has no club_id.`);
        }

    } catch (err) {
        console.error("Simulation Error:", err);
    } finally {
        setTimeout(() => process.exit(), 1000);
    }
}

// Running with Event 14 (should trigger notifications for Club 19 Head/Mentor)
simulateRegistration(14, 1, { full_name: "Test Student" });
