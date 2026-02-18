
import { db } from "./src/config/db.js";

const checkNotifications = async () => {
    try {
        const [rows] = await db.query(`
            SELECT * FROM notification 
            WHERE user_id IN (14, 15) 
            ORDER BY created_at DESC 
            LIMIT 5
        `);
        console.log("NOTIFICATIONS FOR 14/15:", JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkNotifications();
