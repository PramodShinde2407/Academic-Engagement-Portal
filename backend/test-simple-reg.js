import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testClubHeadRegistration() {
    console.log('Testing Club Head Registration...\n');

    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Club Head',
            email: 'clubhead@test.com',
            password: 'password123',
            department: 'Computer',
            year: 3,
            role_id: 4,
            secret_key: 'TECH_CLUB_SECRET_2024'
        });

        console.log('✅ SUCCESS:', response.data);
    } catch (err) {
        console.log('❌ FAILED:');
        console.log('Status:', err.response?.status);
        console.log('Message:', err.response?.data?.message);
        console.log('Data:', err.response?.data);
    }
}

testClubHeadRegistration();
