
import { db } from "./src/config/db.js";

const createTestEvent = async () => {
    try {
        const [res] = await db.query(`
            INSERT INTO event (title, description, date, venue, status, club_id, organizer_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, ['CSI Test Event', 'Testing notifications', '2026-03-01', 'Lab 1', 'APPROVED', 19, 15]);

        console.log("Created test event with ID:", res.insertId);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
createTestEvent();
