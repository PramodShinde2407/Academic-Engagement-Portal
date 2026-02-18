
import { db } from "./src/config/db.js";
import fs from "fs";

const LOG_FILE = "audit-count.log";

function log(msg) {
    fs.appendFileSync(LOG_FILE, msg + "\n");
}

async function count() {
    try {
        fs.writeFileSync(LOG_FILE, "Starting count...\n");
        const [rows] = await db.query("SELECT COUNT(*) as count FROM event_registration");
        log("Count: " + rows[0].count);
    } catch (err) {
        log("ERROR: " + err.message);
    } finally {
        process.exit();
    }
}

count();
