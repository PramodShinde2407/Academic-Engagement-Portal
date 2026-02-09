import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testRegistrationSystem() {
    console.log('🧪 Testing Registration System\n');
    console.log('='.repeat(60));

    try {
        // Test 1: Check if backend is running
        console.log('\n1️⃣  Testing Backend Connection...');
        try {
            const response = await axios.get(`${API_URL}/users/roles`);
            console.log('   ✅ Backend is running!');
            console.log(`   📋 Roles found: ${response.data.length}`);

            if (response.data.length === 0) {
                console.log('   ⚠️  WARNING: No roles in database!');
            } else {
                console.log('\n   Roles available:');
                response.data.forEach(role => {
                    console.log(`      - ${role.role_name} (ID: ${role.role_id})`);
                });
            }
        } catch (err) {
            console.log('   ❌ Backend connection failed!');
            console.log(`   Error: ${err.message}`);
            if (err.code === 'ECONNREFUSED') {
                console.log('   💡 Make sure backend is running: npm run dev');
            }
            return;
        }

        // Test 2: Try a test registration (Student - no key needed)
        console.log('\n2️⃣  Testing Student Registration...');
        const testStudent = {
            name: 'Test Student',
            email: `test${Date.now()}@example.com`,
            password: 'password123',
            department: 'Computer Science',
            year: 2,
            role_id: 1
        };

        try {
            const regResponse = await axios.post(`${API_URL}/auth/register`, testStudent);
            console.log('   ✅ Student registration works!');
            console.log(`   Message: ${regResponse.data.message}`);
        } catch (err) {
            console.log('   ❌ Student registration failed!');
            console.log(`   Error: ${err.response?.data?.message || err.message}`);

            if (err.message.includes('ECONNREFUSED')) {
                console.log('   💡 Database connection issue - check .env file');
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('\n✅ Test Complete!\n');

    } catch (err) {
        console.log('\n❌ Unexpected error:', err.message);
    }
}

testRegistrationSystem();
