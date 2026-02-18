import { db } from "./src/config/db.js";

const verifyData = async () => {
    try {
        // efficient query to find an event with a club that has both head and mentor
        const [rows] = await db.query(`
      SELECT 
        e.event_id, 
        e.title, 
        e.club_id, 
        c.name as club_name, 
        c.club_head_id, 
        c.club_mentor_id
      FROM event e
      JOIN club c ON e.club_id = c.club_id
      WHERE c.club_head_id IS NOT NULL 
      AND c.club_mentor_id IS NOT NULL
      LIMIT 1
    `);

        if (rows.length === 0) {
            console.log("No suitable event found (need event -> club -> head & mentor)");

            // extensive check
            const [clubs] = await db.query("SELECT * FROM club");
            console.log("CLUBS:", JSON.stringify(clubs, null, 2));

            const [events] = await db.query("SELECT * FROM event");
            console.log("EVENTS:", JSON.stringify(events, null, 2));
        } else {
            console.log("FOUND SUITABLE DATA:", rows[0]);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyData();
