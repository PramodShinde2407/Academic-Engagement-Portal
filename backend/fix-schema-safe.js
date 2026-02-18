
import { db } from "./src/config/db.js";

const fixSchema = async () => {
    try {
        console.log("Checking columns...");
        const [cols] = await db.query("SHOW COLUMNS FROM club_application");
        const fields = cols.map(c => c.Field);

        if (!fields.includes('head_approval_status')) {
            console.log("Adding head_approval_status...");
            await db.query("ALTER TABLE club_application ADD COLUMN head_approval_status VARCHAR(50) DEFAULT 'Pending'");
        }

        if (!fields.includes('mentor_approval_status')) {
            console.log("Adding mentor_approval_status...");
            await db.query("ALTER TABLE club_application ADD COLUMN mentor_approval_status VARCHAR(50) DEFAULT 'Pending'");
        }

        console.log("Done.");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fixSchema();
