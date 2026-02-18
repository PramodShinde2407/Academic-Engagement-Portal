import { db } from "./src/config/db.js";

const checkSchema = async () => {
    try {
        const [rows] = await db.query("DESCRIBE event");
        console.log("EVENT TABLE SCHEMA:", JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkSchema();
