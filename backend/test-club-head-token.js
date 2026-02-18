import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testClubHeadToken() {
    console.log('🧪 Testing Club Head Token & Permission Request\n');
    console.log('='.repeat(80));

    try {
        // Test with a known Club Head user
        const testEmail = 'ch@gmail.com';
        const testPassword = 'password123'; // You may need to adjust this

        console.log('\n1️⃣  Attempting login as Club Head...');
        console.log(`   Email: ${testEmail}`);

        let loginResponse;
        try {
            loginResponse = await axios.post(`${API_URL}/auth/login`, {
                email: testEmail,
                password: testPassword
            });

            console.log('   ✅ Login successful!');
            console.log('   User:', JSON.stringify(loginResponse.data.user, null, 2));
            console.log('   Token (first 50 chars):', loginResponse.data.token.substring(0, 50) + '...');

        } catch (err) {
            console.log('   ❌ Login failed:', err.response?.data?.message || err.message);
            console.log('   💡 Try different passwords: password123, ch, ch123, 123456');
            return;
        }

        const token = loginResponse.data.token;
        const user = loginResponse.data.user;

        // Test fetching clubs
        console.log('\n2️⃣  Testing /clubs endpoint with token...');
        try {
            const clubsResponse = await axios.get(`${API_URL}/clubs`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const myClubs = clubsResponse.data.filter(club => club.club_head_id === user.id);
            console.log(`   ✅ Found ${myClubs.length} clubs where user is club head`);
            myClubs.forEach(club => {
                console.log(`      - ${club.name} (ID: ${club.club_id})`);
            });

        } catch (err) {
            console.log('   ❌ Failed to fetch clubs:', err.response?.data?.message || err.message);
        }

        // Test permission request creation
        console.log('\n3️⃣  Testing /permissions/create endpoint...');
        try {
            const permissionData = {
                subject: 'Test Event',
                description: 'This is a test permission request',
                location: 'Test Location',
                event_date: '2026-03-01',
                start_time: '10:00',
                end_time: '12:00',
                club_id: 5 // Photography Club
            };

            const permissionResponse = await axios.post(
                `${API_URL}/permissions/create`,
                permissionData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log('   ✅ Permission request created successfully!');
            console.log('   Response:', JSON.stringify(permissionResponse.data, null, 2));

        } catch (err) {
            console.log('   ❌ Failed to create permission request');
            console.log('   Status:', err.response?.status);
            console.log('   Message:', err.response?.data?.message || err.message);
            console.log('   Full error:', JSON.stringify(err.response?.data, null, 2));
        }

        console.log('\n' + '='.repeat(80));
        console.log('\n✅ Test Complete!\n');

    } catch (err) {
        console.log('\n❌ Unexpected error:', err.message);
        console.log(err.stack);
    }
}

testClubHeadToken();
