
import { db } from "./src/config/db.js";

async function verifyNotification() {
    try {
        console.log("Checking last notification created...");
        const [notifications] = await db.query("SELECT * FROM notification ORDER BY notification_id DESC LIMIT 3");
        console.log("Latest notifications:", JSON.stringify(notifications, null, 2));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        setTimeout(() => process.exit(), 1000);
    }
}

verifyNotification();
