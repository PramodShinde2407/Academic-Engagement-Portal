
import { db } from "./src/config/db.js";

const checkUser = async () => {
    try {
        const [rows] = await db.query("SELECT user_id, name, role_id FROM user WHERE user_id = 3");
        console.log("USER 3:", JSON.stringify(rows[0], null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
checkUser();
