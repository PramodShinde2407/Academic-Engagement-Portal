import { db } from "./src/config/db.js";

const checkClubSchema = async () => {
    try {
        const [rows] = await db.query("DESCRIBE club");
        console.log("CLUB TABLE SCHEMA:", JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkClubSchema();
