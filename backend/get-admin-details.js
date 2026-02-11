import { db } from './src/config/db.js';

async function getAdminDetails() {
    try {
        console.log('\n🔍 Checking Admin Users and Keys...\n');
        console.log('═'.repeat(60));

        // Get all admin users
        const [adminUsers] = await db.query(`
            SELECT u.user_id, u.name, u.email, u.department, u.year, r.role_name
            FROM user u
            JOIN role r ON u.role_id = r.role_id
            WHERE r.role_name = 'Admin'
        `);

        console.log('\n📋 ADMIN USERS:\n');
        if (adminUsers.length === 0) {
            console.log('   ❌ No admin users found');
        } else {
            adminUsers.forEach((admin, index) => {
                console.log(`   ${index + 1}. ID: ${admin.user_id}`);
                console.log(`      Name: ${admin.name}`);
                console.log(`      Email: ${admin.email}`);
                console.log(`      Department: ${admin.department || 'N/A'}`);
                console.log(`      Year: ${admin.year || 'N/A'}`);
                console.log('');
            });
        }

        // Get admin keys
        const [adminKeys] = await db.query('SELECT * FROM admin_key');

        console.log('═'.repeat(60));
        console.log('\n🔑 ADMIN KEYS:\n');
        if (adminKeys.length === 0) {
            console.log('   ❌ No admin keys found');
        } else {
            adminKeys.forEach((key, index) => {
                console.log(`   ${index + 1}. Key: ${key.key_value}`);
                console.log(`      Used: ${key.used ? '✅ Yes' : '❌ No (Available)'}`);
                console.log(`      ID: ${key.key_id}`);
                console.log('');
            });
        }

        console.log('═'.repeat(60) + '\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await db.end();
    }
}

getAdminDetails();
