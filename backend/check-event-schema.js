import { db } from "./src/config/db.js";

async function checkSchema() {
    try {
        console.log("=== CHECKING event_registration SCHEMA ===");
        const [rows] = await db.query("DESCRIBE event_registration");
        rows.forEach(row => {
            console.log(`${row.Field} | ${row.Type} | ${row.Null} | ${row.Key} | ${row.Default} | ${row.Extra}`);
        });
        process.exit();
    } catch (err) {
        console.error("Failed:", err);
        process.exit(1);
    }
}

checkSchema();
