import { db } from './src/config/db.js';

async function manageAdmins() {
    try {
        console.log('\n🔍 Checking Admin Users...\n');
        console.log('═'.repeat(60));

        // Get all admin users (role_id = 4)
        const [adminUsers] = await db.query(`
            SELECT u.user_id, u.name, u.email, u.department, u.year
            FROM user u
            WHERE u.role_id = 4
        `);

        console.log('\n📋 ADMIN USERS FOUND:\n');
        if (adminUsers.length === 0) {
            console.log('   ✅ No admin users exist in the database\n');
        } else {
            adminUsers.forEach((admin, index) => {
                console.log(`   ${index + 1}. User ID: ${admin.user_id}`);
                console.log(`      Name: ${admin.name}`);
                console.log(`      Email: ${admin.email}`);
                console.log(`      Department: ${admin.department || 'N/A'}`);
                console.log(`      Year: ${admin.year || 'N/A'}`);
                console.log('');
            });

            // Delete all admin users
            console.log('🗑️  Deleting all admin users...\n');
            const [deleteResult] = await db.query('DELETE FROM user WHERE role_id = 4');
            console.log(`   ✅ Deleted ${deleteResult.affectedRows} admin user(s)\n`);
        }

        console.log('═'.repeat(60));

        // Reset admin key to unused
        console.log('\n🔄 Resetting admin key...\n');
        const [resetResult] = await db.query("UPDATE admin_key SET used = 0 WHERE key_value = 'ADMIN_KEY_2024'");

        if (resetResult.affectedRows > 0) {
            console.log('   ✅ Admin key "ADMIN_KEY_2024" reset to unused\n');
        } else {
            console.log('   ℹ️  Admin key was already unused or not found\n');
        }

        console.log('═'.repeat(60));
        console.log('\n✅ READY FOR NEW ADMIN REGISTRATION');
        console.log('\n   Use key: ADMIN_KEY_2024');
        console.log('   Role: Admin (role_id = 4)\n');
        console.log('═'.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await db.end();
    }
}

manageAdmins();
