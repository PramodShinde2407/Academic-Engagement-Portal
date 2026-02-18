
import { db } from "./src/config/db.js";

const checkEventsForClubs = async () => {
    try {
        const [events] = await db.query("SELECT event_id, title, club_id FROM event WHERE club_id IN (17, 19)");
        console.log("EVENTS FOR CLUBS 17/19:", JSON.stringify(events, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkEventsForClubs();
