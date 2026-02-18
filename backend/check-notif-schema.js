import { db } from "./src/config/db.js";

const checkNotificationSchema = async () => {
    try {
        const [rows] = await db.query("DESCRIBE notification");
        console.log("NOTIFICATION TABLE SCHEMA:", JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkNotificationSchema();
