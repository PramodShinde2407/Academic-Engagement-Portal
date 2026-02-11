import { db } from "./src/config/db.js";

async function updateSchema() {
    try {
        console.log("Updating event_registration schema...");

        const alterQuery = `
            ALTER TABLE event_registration
            ADD COLUMN full_name VARCHAR(255),
            ADD COLUMN email VARCHAR(255),
            ADD COLUMN phone VARCHAR(20),
            ADD COLUMN department VARCHAR(100),
            ADD COLUMN year INT,
            ADD COLUMN roll_no VARCHAR(50),
            ADD COLUMN notes TEXT
        `;

        await db.query(alterQuery);
        console.log("Schema updated successfully! ✅");
        process.exit(0);
    } catch (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log("Columns already exist. Skipping upgrade. ✅");
            process.exit(0);
        }
        console.error("Failed to update schema:", err);
        process.exit(1);
    }
}

updateSchema();
