
import { db } from "./src/config/db.js";

const checkClubs = async () => {
    try {
        const [clubs] = await db.query("SELECT club_id, name, club_head_id, club_mentor_id FROM club");
        console.log("CLUBS:", JSON.stringify(clubs, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkClubs();
