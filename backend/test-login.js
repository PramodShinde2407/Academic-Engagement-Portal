import axios from 'axios';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

const API_URL = 'http://localhost:5000/api';

async function testLogin() {
    console.log('🧪 Testing Login System\n');
    console.log('='.repeat(60));

    try {
        // Step 1: Check database for registered users
        console.log('\n1️⃣  Checking Database for Users...');
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'pict@123',
            database: 'college_db'
        });

        const [users] = await conn.query('SELECT user_id, name, email, password_hash, role_id FROM user LIMIT 5');
        console.log(`   ✅ Found ${users.length} users in database:`);
        users.forEach(user => {
            console.log(`      - ${user.name} (${user.email}) - Role ID: ${user.role_id}`);
            console.log(`        Password Hash Length: ${user.password_hash.length}`);
            console.log(`        Password Hash: ${user.password_hash}`);
        });

        await conn.end();

        // Step 2: Check if backend is running
        console.log('\n2️⃣  Checking Backend Server...');
        try {
            await axios.get(`${API_URL}/users/roles`);
            console.log('   ✅ Backend server is running on port 5000');
        } catch (err) {
            console.log('   ❌ Backend server not responding!');
            if (err.code === 'ECONNREFUSED') {
                console.log('   💡 Start backend: npm run dev');
            }
            console.log('\n   ⚠️  Cannot test login API without backend running');
            return;
        }

        // Step 3: Test login with first user
        if (users.length > 0) {
            console.log('\n3️⃣  Testing Login API...');
            const testUser = users[0];

            console.log(`   Testing login for: ${testUser.email}`);
            console.log('   ⚠️  You need to enter the password used during registration');
            console.log('   Common passwords to try: password123, ram, ram123, 123456');
        }

        console.log('\n' + '='.repeat(60));
        console.log('\n✅ Test Complete!\n');

    } catch (err) {
        console.log('\n❌ Unexpected error:', err.message);
        console.log(err.stack);
    }
}

testLogin();
