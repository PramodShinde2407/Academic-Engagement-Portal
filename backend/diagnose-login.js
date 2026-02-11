import { db } from "./src/config/db.js";
import { UserModel } from "./src/models/user.model.js";
import { hashPassword, comparePassword } from "./src/utils/password.js";

async function diagnose() {
    try {
        console.log("=== DIAGNOSING LOGIN ISSUES ===");

        // 1. Check Roles
        const [roles] = await db.query("SELECT * FROM role");
        console.log("\n--- ROLES ---");
        console.table(roles);

        // 2. Check Users
        const [users] = await db.query("SELECT user_id, name, email, role_id, password_hash FROM user");
        console.log("\n--- USERS ---");
        // Don't print full hash to keep output clean, just first few chars
        const safeUsers = users.map(u => ({ ...u, password_hash: u.password_hash.substring(0, 10) + '...' }));
        console.table(safeUsers);

        // 3. Test findByEmail for the first user
        if (users.length > 0) {
            const testEmail = users[0].email;
            console.log(`\n--- TESTING FindByEmail for: ${testEmail} ---`);

            const userWithRole = await UserModel.findByEmail(testEmail);
            console.log("Result:", userWithRole);

            if (!userWithRole) {
                console.error("❌ findByEmail returned NULL! usage of JOIN likely failed.");
                console.log(`Check if role_id ${users[0].role_id} exists in 'role' table.`);
            } else {
                console.log("✅ findByEmail working correctly.");
            }
        } else {
            console.log("\n⚠ No users found in database.");
        }

        // 4. Test Password Hashing & Verification
        console.log("\n--- TESTING PASSWORD VERIFICATION ---");
        const testPlain = "password123";
        const testHash = await hashPassword(testPlain);
        console.log(`Generated hash for '${testPlain}': ${testHash}`);

        const isMatch = await comparePassword(testPlain, testHash);
        console.log(`Comparison result: ${isMatch}`);

        if (isMatch) {
            console.log("✅ Password hashing and comparison logic is working.");
        } else {
            console.error("❌ Password comparison FAILED internally.");
        }

        process.exit();
    } catch (err) {
        console.error("Diagnosis failed:", err);
        process.exit(1);
    }
}

diagnose();
