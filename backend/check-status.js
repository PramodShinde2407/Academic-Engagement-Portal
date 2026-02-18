import { db } from "./src/config/db.js";

const checkStatusEnum = async () => {
    try {
        const [rows] = await db.query("SHOW COLUMNS FROM event LIKE 'status'");
        console.log("STATUS COLUMN TYPE:", rows[0].Type);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkStatusEnum();
