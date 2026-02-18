
import { db } from "./src/config/db.js";

async function findData() {
    try {
        console.log("Checking events for clubs: 17, 19, 20...");

        const [events] = await db.query(`
      SELECT event_id, title, club_id 
      FROM event 
      WHERE club_id IN (17, 19, 20)
    `);

        console.log("Events:", JSON.stringify(events, null, 2));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        setTimeout(() => process.exit(), 1000);
    }
}

findData();
