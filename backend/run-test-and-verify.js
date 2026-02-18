
import { db } from "./src/config/db.js";
import { NotificationModel } from "./src/models/notification.model.js";
import { ClubModel } from "./src/models/club.model.js";
import { EventModel } from "./src/models/event.model.js";
import fs from "fs";

const LOG_FILE = "test-output.log";

function log(msg) {
    fs.appendFileSync(LOG_FILE, msg + "\n");
}

async function runTest() {
    try {
        fs.writeFileSync(LOG_FILE, "Starting test...\n");

        const eventId = 14;
        const userId = 1;
        const formData = { full_name: "Test Student From Script" };

        log(`Simulating registration for Event ID: ${eventId}`);

        // Fetch Event
        const event = await EventModel.getById(eventId);
        log("Event fetched: " + JSON.stringify(event));

        if (!event) throw new Error("Event not found");

        // Fetch Club
        const club = await ClubModel.getById(event.club_id);
        log("Club fetched: " + JSON.stringify(club));

        if (!club) throw new Error("Club not found");

        // Determine Recipients
        const recipients = [];
        if (club.club_head_id) recipients.push(club.club_head_id);
        if (club.club_mentor_id) recipients.push(club.club_mentor_id);

        log(`Recipients: ${JSON.stringify(recipients)}`);

        // Create Notifications
        for (const recipientId of recipients) {
            try {
                log(`Creating notification for User ${recipientId}...`);
                const notifId = await NotificationModel.createNotification({
                    user_id: recipientId,
                    title: 'Test Notification',
                    message: `Test message for User ${recipientId}`,
                    type: 'info',
                    link: `/test-link`
                });
                log(`SUCCESS: Created Notification ID ${notifId} for User ${recipientId}`);
            } catch (err) {
                log(`ERROR: Failed for User ${recipientId}: ${err.message}`);
            }
        }

        // Verify
        log("\n--- VERIFICATION ---");
        const [rows] = await db.query("SELECT * FROM notification ORDER BY notification_id DESC LIMIT 5");
        log(JSON.stringify(rows, null, 2));

    } catch (err) {
        log("FATAL ERROR: " + err.message);
    } finally {
        process.exit();
    }
}

runTest();
