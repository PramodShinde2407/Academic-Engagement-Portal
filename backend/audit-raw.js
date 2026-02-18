
import { db } from "./src/config/db.js";
import fs from "fs";

const LOG_FILE = "audit-raw.log";

function log(msg) {
    fs.appendFileSync(LOG_FILE, msg + "\n");
}

async function auditRaw() {
    try {
        fs.writeFileSync(LOG_FILE, "Starting audit raw...\n");
        const [rows] = await db.query("SELECT * FROM event_registration LIMIT 6");
        log(JSON.stringify(rows, null, 2));
    } catch (err) {
        log("ERROR: " + err.message);
    } finally {
        process.exit();
    }
}

auditRaw();
