
import { db } from "./src/config/db.js";

const verifyData = async () => {
    try {
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

        if (rows.length > 0) {
            console.log("FOUND_SUITABLE_DATA: " + JSON.stringify(rows[0]));
        } else {
            console.log("NO_SUITABLE_DATA_FOUND");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyData();
