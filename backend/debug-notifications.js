
import { db } from "./src/config/db.js";

async function debug() {
    try {
        console.log("Starting debug script...");

        console.log("--- CLUBS ---");
        const [clubs] = await db.query("SELECT club_id, name, club_head_id, club_mentor_id FROM club");
        console.log(JSON.stringify(clubs, null, 2));

        console.log("\n--- EVENTS ---");
        const [events] = await db.query("SELECT event_id, title, club_id FROM event ORDER BY event_id DESC LIMIT 5");
        console.log(JSON.stringify(events, null, 2));

        console.log("\n--- NOTIFICATIONS ---");
        const [notifications] = await db.query("SELECT notification_id, user_id, title, message, type, link FROM notification ORDER BY notification_id DESC LIMIT 5");
        console.log(JSON.stringify(notifications, null, 2));

        console.log("\n--- NOTIFICATION TABLE SCHEMA ---");
        const [columns] = await db.query("DESCRIBE notification");
        console.log(JSON.stringify(columns, null, 2));

    } catch (error) {
        console.error("Error occurred:", error);
    } finally {
        console.log("Debug script finished.");
        process.exit();
    }
}

debug();
