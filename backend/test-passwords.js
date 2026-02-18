import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testMultiplePasswords() {
    console.log('🧪 Testing Club Head Login with Multiple Passwords\n');
    console.log('='.repeat(80));

    const testEmail = 'ch@gmail.com';
    const passwords = ['password123', 'ch', 'ch123', '123456', 'Ch@123', 'clubhead', 'test123'];

    for (const password of passwords) {
        try {
            console.log(`\nTrying password: "${password}"`);
            const loginResponse = await axios.post(`${API_URL}/auth/login`, {
                email: testEmail,
                password: password
            });

            console.log('   ✅ SUCCESS! Password is:', password);
            console.log('   User:', JSON.stringify(loginResponse.data.user, null, 2));
            console.log('   Token (first 50 chars):', loginResponse.data.token.substring(0, 50) + '...');

            // Now test permission creation
            const token = loginResponse.data.token;
            console.log('\n🔍 Testing permission request creation...');

            try {
                const permissionData = {
                    subject: 'Test Event',
                    description: 'This is a test permission request',
                    location: 'Test Location',
                    event_date: '2026-03-01',
                    start_time: '10:00',
                    end_time: '12:00',
                    club_id: 5
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
                console.log('   ❌ Permission creation failed');
                console.log('   Status:', err.response?.status);
                console.log('   Message:', err.response?.data?.message || err.message);
            }

            return; // Exit after successful login

        } catch (err) {
            console.log(`   ❌ Failed with: ${err.response?.data?.message || err.message}`);
        }
    }

    console.log('\n❌ None of the passwords worked!');
    console.log('💡 You may need to register a new Club Head user or reset the password.');
}

testMultiplePasswords();
