import mysql from 'mysql2/promise';

async function viewUsers() {
    console.log('👥 Database Users\n');
    console.log('='.repeat(80));

    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'pict@123',
            database: 'college_db'
        });

        // Get all users with their role information
        const [users] = await conn.query(`
            SELECT 
                u.user_id,
                u.name,
                u.email,
                u.department,
                u.year,
                r.role_name,
                LENGTH(u.password_hash) as hash_length
            FROM user u
            JOIN role r ON u.role_id = r.role_id
            ORDER BY u.user_id
        `);

        if (users.length === 0) {
            console.log('\n⚠️  No users found in database!');
            console.log('   Register a new user to get started.\n');
        } else {
            console.log(`\n📊 Found ${users.length} user(s):\n`);

            users.forEach((user, index) => {
                console.log(`${index + 1}. User ID: ${user.user_id}`);
                console.log(`   Name: ${user.name}`);
                console.log(`   Email: ${user.email}`);
                console.log(`   Role: ${user.role_name}`);
                console.log(`   Department: ${user.department || 'N/A'}`);
                console.log(`   Year: ${user.year || 'N/A'}`);
                console.log(`   Password Hash: ${user.hash_length === 60 ? '✅ Valid' : '❌ Invalid'}`);
                console.log('');
            });

            console.log('='.repeat(80));
            console.log('\n💡 To login, use the email and password you used during registration.');
            console.log('   If you forgot the password, run: node reset-password.js\n');
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

viewUsers();
