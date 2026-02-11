import { db } from "./src/config/db.js";

async function checkSchema() {
    try {
        console.log("=== CHECKING club_member SCHEMA ===");
        const [rows] = await db.query("DESCRIBE club_member");
        console.table(rows);
        process.exit();
    } catch (err) {
        console.error("Failed:", err);
        process.exit(1);
    }
}

checkSchema();
