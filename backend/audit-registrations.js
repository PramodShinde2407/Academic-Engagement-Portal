
import { db } from "./src/config/db.js";
import fs from "fs";

const LOG_FILE = "audit-output.log";

function log(msg) {
    fs.appendFileSync(LOG_FILE, msg + "\n");
}

async function audit() {
    try {
        fs.writeFileSync(LOG_FILE, "Starting audit...\n");

        // Get last 10 event registrations
        const [rows] = await db.query(`
      SELECT 
        er.registration_id,
        er.event_id,
        er.student_id,
        er.full_name,
        e.title as event_title,
        e.club_id,
        c.name as club_name,
        c.club_head_id,
        c.club_mentor_id
      FROM event_registration er
      join event e ON er.event_id = e.event_id
      join club c ON e.club_id = c.club_id
      ORDER BY er.registration_id DESC
      LIMIT 10
    `);

        log(JSON.stringify(rows, null, 2));

    } catch (err) {
        log("ERROR: " + err.message);
    } finally {
        process.exit();
    }
}

audit();
