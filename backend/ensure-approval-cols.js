
import { db } from "./src/config/db.js";

const forceApprovalStatus = async () => {
    try {
        console.log("Forcing club_application to have approval status columns...");

        await db.query(`
            ALTER TABLE club_application 
            ADD COLUMN IF NOT EXISTS head_approval_status VARCHAR(50) DEFAULT 'Pending',
            ADD COLUMN IF NOT EXISTS mentor_approval_status VARCHAR(50) DEFAULT 'Pending';
        `);

        console.log("Columns ensured.");

        const [rows] = await db.query("DESCRIBE club_application");
        console.log("SCHEMA:", JSON.stringify(rows, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
forceApprovalStatus();
