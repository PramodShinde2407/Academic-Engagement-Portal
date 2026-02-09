import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

async function diagnoseLogin() {
    console.log('🔍 Login Diagnostic Tool\n');
    console.log('='.repeat(70));

    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'pict@123',
            database: 'college_db'
        });

        // Get all users
        const [users] = await conn.query(`
            SELECT u.user_id, u.name, u.email, u.password_hash, 
                   LENGTH(u.password_hash) as hash_length, r.role_name
            FROM user u
            JOIN role r ON u.role_id = r.role_id
            ORDER BY u.user_id
        `);

        console.log(`\n📊 Found ${users.length} registered users:\n`);

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role_name}`);
            console.log(`   Hash Length: ${user.hash_length} (should be 60 for bcrypt)`);

            if (user.hash_length !== 60) {
                console.log(`   ⚠️  WARNING: Hash length is incorrect! Should be 60.`);
                console.log(`   This user cannot login until password is reset.`);
            }
            console.log('');
        });

        console.log('='.repeat(70));
        console.log('\n💡 TROUBLESHOOTING STEPS:\n');

        console.log('1. Make sure backend server is running:');
        console.log('   cd backend');
        console.log('   npm run dev\n');

        console.log('2. Use the EXACT password you used during registration\n');

        console.log('3. If you forgot the password, you can reset it:');
        console.log('   - Delete the user from database');
        console.log('   - Register again with a new password\n');

        console.log('4. To delete a user (replace email):');
        console.log('   DELETE FROM user WHERE email = \'your@email.com\';\n');

        // Check if any hash is invalid
        const invalidUsers = users.filter(u => u.hash_length !== 60);
        if (invalidUsers.length > 0) {
            console.log('⚠️  CRITICAL: Found users with invalid password hashes!');
            console.log('   These users need to be deleted and re-registered:\n');
            invalidUsers.forEach(u => {
                console.log(`   DELETE FROM user WHERE email = '${u.email}';`);
            });
            console.log('');
        }

        await conn.end();

    } catch (err) {
        console.log('\n❌ Error:', err.message);
        if (err.code === 'ECONNREFUSED') {
            console.log('\n💡 Cannot connect to database. Check:');
            console.log('   - MySQL is running');
            console.log('   - Credentials in .env are correct');
        }
    }
}

diagnoseLogin();
