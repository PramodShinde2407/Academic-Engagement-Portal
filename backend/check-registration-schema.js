
import { db } from "./src/config/db.js";

async function checkSchema() {
    try {
        const [columns] = await db.query("DESCRIBE event_registration");
        console.log(JSON.stringify(columns, null, 2));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        process.exit();
    }
}

checkSchema();
