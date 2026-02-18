import axios from 'axios';
import readline from 'readline';

const API_URL = 'http://localhost:5000/api';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function testFullFlow() {
    console.log('🧪 Complete Club Head Permission Request Test\n');
    console.log('='.repeat(80));

    try {
        // Step 1: Login
        console.log('\n1️⃣  LOGIN TEST');
        console.log('─'.repeat(80));

        const email = await question('Enter Club Head email (e.g., ch@gmail.com): ');
        const password = await question('Enter password: ');

        let token, user;

        try {
            const loginResponse = await axios.post(`${API_URL}/auth/login`, {
                email: email.trim(),
                password: password.trim()
            });

            token = loginResponse.data.token;
            user = loginResponse.data.user;

            console.log('\n✅ Login successful!');
            console.log('   User:', user.name);
            console.log('   Email:', user.email);
            console.log('   Role:', user.role_name);
            console.log('   User ID:', user.id);

        } catch (err) {
            console.log('\n❌ Login failed:', err.response?.data?.message || err.message);
            rl.close();
            return;
        }

        // Step 2: Fetch clubs
        console.log('\n2️⃣  FETCH CLUBS TEST');
        console.log('─'.repeat(80));

        try {
            const clubsResponse = await axios.get(`${API_URL}/clubs`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const myClubs = clubsResponse.data.filter(club => club.club_head_id === user.id);

            console.log(`\n✅ Found ${myClubs.length} clubs where you are club head:`);
            myClubs.forEach((club, index) => {
                console.log(`   ${index + 1}. ${club.name} (ID: ${club.club_id})`);
            });

            if (myClubs.length === 0) {
                console.log('\n⚠️  WARNING: You are not assigned as club head to any club!');
                console.log('   You need to be assigned to a club to create permission requests.');
                rl.close();
                return;
            }

            // Step 3: Create permission request
            console.log('\n3️⃣  CREATE PERMISSION REQUEST TEST');
            console.log('─'.repeat(80));

            const clubId = myClubs[0].club_id;
            console.log(`\nUsing club: ${myClubs[0].name} (ID: ${clubId})`);

            const permissionData = {
                subject: 'Test Event - ' + new Date().toISOString(),
                description: 'This is an automated test permission request',
                location: 'Test Location',
                event_date: '2026-03-15',
                start_time: '10:00',
                end_time: '12:00',
                club_id: clubId
            };

            console.log('\nSending permission request...');

            const permissionResponse = await axios.post(
                `${API_URL}/permissions/create`,
                permissionData,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log('\n✅ Permission request created successfully!');
            console.log('   Request ID:', permissionResponse.data.request_id);
            console.log('   Message:', permissionResponse.data.message);

            // Step 4: Fetch my requests
            console.log('\n4️⃣  FETCH MY REQUESTS TEST');
            console.log('─'.repeat(80));

            const myRequestsResponse = await axios.get(
                `${API_URL}/permissions/my-requests`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log(`\n✅ Found ${myRequestsResponse.data.length} permission request(s):`);
            myRequestsResponse.data.slice(0, 3).forEach((req, index) => {
                console.log(`\n   ${index + 1}. ${req.subject}`);
                console.log(`      Status: ${req.current_status}`);
                console.log(`      Date: ${req.event_date}`);
                console.log(`      Location: ${req.location}`);
            });

        } catch (err) {
            console.log('\n❌ Request failed');
            console.log('   Status:', err.response?.status);
            console.log('   Message:', err.response?.data?.message || err.message);

            if (err.response?.status === 401) {
                console.log('\n💡 This is an authentication error. Token might be invalid.');
            } else if (err.response?.status === 403) {
                console.log('\n💡 This is an authorization error. You might not have the right role.');
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('\n✅ Test Complete!\n');

    } catch (err) {
        console.log('\n❌ Unexpected error:', err.message);
        console.log(err.stack);
    }

    rl.close();
}

testFullFlow();
