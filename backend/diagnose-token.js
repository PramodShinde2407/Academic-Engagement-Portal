import jwt from 'jsonwebtoken';
import { env } from './src/config/env.js';
import mysql from 'mysql2/promise';

async function diagnoseToken() {
    console.log('🔍 Token Diagnostic Tool\n');
    console.log('='.repeat(80));

    // Get token from user input
    console.log('\n📋 INSTRUCTIONS:');
    console.log('1. Open your browser');
    console.log('2. Open Developer Tools (F12)');
    console.log('3. Go to Console tab');
    console.log('4. Type: localStorage.getItem("token")');
    console.log('5. Copy the token value (without quotes)');
    console.log('6. Paste it below when prompted\n');

    const readline = await import('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Paste your token here: ', async (token) => {
        try {
            if (!token || token.trim() === '') {
                console.log('\n❌ No token provided!');
                console.log('💡 This means the user is not logged in or the token was not saved.');
                rl.close();
                return;
            }

            console.log('\n1️⃣  Decoding Token...');
            let decoded;
            try {
                decoded = jwt.verify(token.trim(), env.jwtSecret);
                console.log('   ✅ Token is valid!');
                console.log('   Decoded payload:', JSON.stringify(decoded, null, 2));
            } catch (err) {
                console.log('   ❌ Token verification failed:', err.message);
                if (err.name === 'TokenExpiredError') {
                    console.log('   💡 Token has expired. User needs to log in again.');
                } else if (err.name === 'JsonWebTokenError') {
                    console.log('   💡 Token is malformed or invalid.');
                }
                rl.close();
                return;
            }

            console.log('\n2️⃣  Checking User in Database...');
            const conn = await mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'pict@123',
                database: 'college_db'
            });

            const [users] = await conn.query(`
                SELECT u.*, r.role_name 
                FROM user u 
                JOIN role r ON u.role_id = r.role_id 
                WHERE u.user_id = ?
            `, [decoded.id]);

            if (users.length === 0) {
                console.log('   ❌ User not found in database!');
                rl.close();
                await conn.end();
                return;
            }

            const user = users[0];
            console.log('   ✅ User found!');
            console.log('   User ID:', user.user_id);
            console.log('   Name:', user.name);
            console.log('   Email:', user.email);
            console.log('   Role ID:', user.role_id);
            console.log('   Role Name:', user.role_name);

            console.log('\n3️⃣  Checking Role Permissions...');
            if (user.role_name === 'Club Head') {
                console.log('   ✅ User IS a Club Head!');

                // Check clubs
                const [clubs] = await conn.query(`
                    SELECT club_id, name 
                    FROM club 
                    WHERE club_head_id = ?
                `, [user.user_id]);

                console.log(`   ✅ User is head of ${clubs.length} club(s):`);
                clubs.forEach(club => {
                    console.log(`      - ${club.name} (ID: ${club.club_id})`);
                });

                if (clubs.length === 0) {
                    console.log('   ⚠️  WARNING: User has Club Head role but is not assigned to any club!');
                }
            } else {
                console.log(`   ❌ User is NOT a Club Head! Current role: ${user.role_name}`);
                console.log('   💡 Only users with "Club Head" role can create permission requests.');
            }

            await conn.end();

            console.log('\n' + '='.repeat(80));
            console.log('\n✅ Diagnostic Complete!\n');

        } catch (err) {
            console.log('\n❌ Error:', err.message);
            console.log(err.stack);
        }

        rl.close();
    });
}

diagnoseToken();
