import mysql from 'mysql2/promise';

async function fixEmail() {
    console.log('🔧 Fixing Email Typo...\n');

    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'pict@123',
            database: 'college_db'
        });

        // Check for the user with the typo
        const [users] = await conn.query('SELECT * FROM user WHERE email = ?', ['jon@gmail.ocm']);

        if (users.length > 0) {
            console.log(`Found user with typo: ${users[0].name} (${users[0].email})`);

            // Update to correct email
            await conn.query('UPDATE user SET email = ? WHERE email = ?', ['jon@gmail.com', 'jon@gmail.ocm']);
            console.log('✅ Email corrected to: jon@gmail.com');
        } else {
            console.log('User with email "jon@gmail.ocm" not found. Checking for "jon@gmail.com"...');
            const [correctUsers] = await conn.query('SELECT * FROM user WHERE email = ?', ['jon@gmail.com']);
            if (correctUsers.length > 0) {
                console.log(`✅ User already has correct email: ${correctUsers[0].email}`);
            } else {
                console.log('❌ Could not find user "jon" with either email.');
            }
        }

        await conn.end();

    } catch (err) {
        console.log('❌ Error:', err.message);
    }
}

fixEmail();
