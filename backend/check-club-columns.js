import { db } from "./src/config/db.js";

const checkClubColumns = async () => {
    try {
        const [rows] = await db.query("SHOW COLUMNS FROM club WHERE Field IN ('club_head_id', 'club_mentor_id')");
        console.log("CLUB COLUMNS:", JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkClubColumns();
