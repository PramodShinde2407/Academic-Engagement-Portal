import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Store tokens and user info
const users = {
    clubHead: null,
    clubMentor: null,
    estateManager: null,
    principal: null,
    director: null
};

let permissionRequestId = null;

console.log('🔍 PERMISSION SYSTEM VERIFICATION TEST\n');
console.log('='.repeat(70));

// Helper function to make authenticated requests
const authRequest = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

async function step1_RegisterUsers() {
    console.log('\n📝 STEP 1: Registering Test Users');
    console.log('-'.repeat(70));

    try {
        // Register Club Head
        console.log('Registering Club Head...');
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Club Head',
            email: 'clubhead@test.com',
            password: 'password123',
            department: 'Computer',
            year: 3,
            role_id: 4,
            secret_key: 'TECH_CLUB_SECRET_2024'
        });
        console.log('✅ Club Head registered');

        // Register Club Mentor
        console.log('Registering Club Mentor...');
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Club Mentor',
            email: 'mentor@test.com',
            password: 'password123',
            role_id: 5,
            secret_key: 'CLUB_MENTOR_KEY_2024'
        });
        console.log('✅ Club Mentor registered');

        // Register Estate Manager
        console.log('Registering Estate Manager...');
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Estate Manager',
            email: 'estate@test.com',
            password: 'password123',
            role_id: 6,
            secret_key: 'ESTATE_MANAGER_KEY_2024'
        });
        console.log('✅ Estate Manager registered');

        // Register Principal
        console.log('Registering Principal...');
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Principal',
            email: 'principal@test.com',
            password: 'password123',
            role_id: 7,
            secret_key: 'PRINCIPAL_KEY_2024'
        });
        console.log('✅ Principal registered');

        // Register Director
        console.log('Registering Director...');
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Director',
            email: 'director@test.com',
            password: 'password123',
            role_id: 8,
            secret_key: 'DIRECTOR_KEY_2024'
        });
        console.log('✅ Director registered');

        console.log('\n✅ All users registered successfully!');
        return true;
    } catch (err) {
        if (err.response?.status === 400 && err.response?.data?.message?.includes('already exists')) {
            console.log('ℹ️  Users already exist, proceeding to login...');
            return true;
        }
        console.error('❌ Registration failed:');
        console.error('   Status:', err.response?.status);
        console.error('   Message:', err.response?.data?.message || err.message);
        console.error('   Full error:', JSON.stringify(err.response?.data, null, 2));
        return false;
    }
}

async function step2_LoginUsers() {
    console.log('\n🔐 STEP 2: Logging In All Users');
    console.log('-'.repeat(70));

    try {
        // Login Club Head
        const chRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'clubhead@test.com',
            password: 'password123'
        });
        users.clubHead = chRes.data;
        console.log('✅ Club Head logged in');

        // Login Club Mentor
        const cmRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'mentor@test.com',
            password: 'password123'
        });
        users.clubMentor = cmRes.data;
        console.log('✅ Club Mentor logged in');

        // Login Estate Manager
        const emRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'estate@test.com',
            password: 'password123'
        });
        users.estateManager = emRes.data;
        console.log('✅ Estate Manager logged in');

        // Login Principal
        const pRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'principal@test.com',
            password: 'password123'
        });
        users.principal = pRes.data;
        console.log('✅ Principal logged in');

        // Login Director
        const dRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'director@test.com',
            password: 'password123'
        });
        users.director = dRes.data;
        console.log('✅ Director logged in');

        console.log('\n✅ All users logged in successfully!');
        return true;
    } catch (err) {
        console.error('❌ Login failed:', err.response?.data?.message || err.message);
        return false;
    }
}

async function step3_CreatePermissionRequest() {
    console.log('\n📋 STEP 3: Creating Permission Request (Club Head)');
    console.log('-'.repeat(70));

    try {
        const response = await axios.post(
            `${API_URL}/permissions/create`,
            {
                subject: 'Tech Fest 2024',
                description: 'Annual technology festival with workshops and competitions',
                location: 'Main Auditorium',
                event_date: '2024-03-15',
                start_time: '10:00:00',
                end_time: '17:00:00'
            },
            authRequest(users.clubHead.token)
        );

        permissionRequestId = response.data.request_id;
        console.log(`✅ Permission request created with ID: ${permissionRequestId}`);
        return true;
    } catch (err) {
        console.error('❌ Failed to create request:', err.response?.data?.message || err.message);
        return false;
    }
}

async function step4_CheckPendingRequests(role, user) {
    console.log(`\n📥 STEP 4.${role}: Checking Pending Requests (${role})`);
    console.log('-'.repeat(70));

    try {
        const response = await axios.get(
            `${API_URL}/permissions/pending`,
            authRequest(user.token)
        );

        console.log(`✅ ${role} has ${response.data.length} pending request(s)`);
        if (response.data.length > 0) {
            console.log(`   Request: "${response.data[0].subject}"`);
        }
        return response.data.length > 0;
    } catch (err) {
        console.error(`❌ Failed to fetch pending requests:`, err.response?.data?.message || err.message);
        return false;
    }
}

async function step5_ApproveRequest(role, user) {
    console.log(`\n✅ STEP 5.${role}: Approving Request (${role})`);
    console.log('-'.repeat(70));

    try {
        const response = await axios.post(
            `${API_URL}/permissions/${permissionRequestId}/approve`,
            { remarks: `Approved by ${role}` },
            authRequest(user.token)
        );

        console.log(`✅ ${role} approved the request`);
        console.log(`   New status: ${response.data.new_status}`);
        console.log(`   Next approver: ${response.data.next_approver || 'FINAL APPROVAL'}`);
        return true;
    } catch (err) {
        console.error(`❌ Approval failed:`, err.response?.data?.message || err.message);
        return false;
    }
}

async function step6_CheckFinalStatus() {
    console.log('\n🎉 STEP 6: Checking Final Request Status');
    console.log('-'.repeat(70));

    try {
        const response = await axios.get(
            `${API_URL}/permissions/${permissionRequestId}`,
            authRequest(users.clubHead.token)
        );

        console.log(`✅ Final Status: ${response.data.current_status}`);
        console.log(`\n📜 Approval History:`);
        response.data.approval_history.forEach((action, index) => {
            console.log(`   ${index + 1}. ${action.approver_role} - ${action.action} (${action.approver_name})`);
            if (action.remarks) {
                console.log(`      Remarks: "${action.remarks}"`);
            }
        });

        return response.data.current_status === 'approved';
    } catch (err) {
        console.error('❌ Failed to fetch status:', err.response?.data?.message || err.message);
        return false;
    }
}

async function runCompleteTest() {
    console.log('\n🚀 Starting Complete Permission System Test...\n');

    const results = {
        registration: false,
        login: false,
        createRequest: false,
        clubMentorPending: false,
        clubMentorApprove: false,
        estateManagerPending: false,
        estateManagerApprove: false,
        principalPending: false,
        principalApprove: false,
        directorPending: false,
        directorApprove: false,
        finalStatus: false
    };

    // Step 1: Register users
    results.registration = await step1_RegisterUsers();
    if (!results.registration) {
        console.log('\n❌ Test failed at registration step');
        return;
    }

    // Step 2: Login users
    results.login = await step2_LoginUsers();
    if (!results.login) {
        console.log('\n❌ Test failed at login step');
        return;
    }

    // Step 3: Create permission request
    results.createRequest = await step3_CreatePermissionRequest();
    if (!results.createRequest) {
        console.log('\n❌ Test failed at request creation step');
        return;
    }

    // Step 4-5: Club Mentor approval
    results.clubMentorPending = await step4_CheckPendingRequests('Club Mentor', users.clubMentor);
    if (results.clubMentorPending) {
        results.clubMentorApprove = await step5_ApproveRequest('Club Mentor', users.clubMentor);
    }

    // Estate Manager approval
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
    results.estateManagerPending = await step4_CheckPendingRequests('Estate Manager', users.estateManager);
    if (results.estateManagerPending) {
        results.estateManagerApprove = await step5_ApproveRequest('Estate Manager', users.estateManager);
    }

    // Principal approval
    await new Promise(resolve => setTimeout(resolve, 500));
    results.principalPending = await step4_CheckPendingRequests('Principal', users.principal);
    if (results.principalPending) {
        results.principalApprove = await step5_ApproveRequest('Principal', users.principal);
    }

    // Director approval
    await new Promise(resolve => setTimeout(resolve, 500));
    results.directorPending = await step4_CheckPendingRequests('Director', users.director);
    if (results.directorPending) {
        results.directorApprove = await step5_ApproveRequest('Director', users.director);
    }

    // Step 6: Check final status
    await new Promise(resolve => setTimeout(resolve, 500));
    results.finalStatus = await step6_CheckFinalStatus();

    // Print summary
    console.log('\n' + '='.repeat(70));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(70));

    const allPassed = Object.values(results).every(r => r === true);

    if (allPassed) {
        console.log('\n🎉 ✅ ALL TESTS PASSED! 🎉');
        console.log('\nThe permission system is working correctly:');
        console.log('  ✅ User registration and login');
        console.log('  ✅ Permission request creation');
        console.log('  ✅ Sequential approval workflow');
        console.log('  ✅ Club Mentor → Estate Manager → Principal → Director');
        console.log('  ✅ Final approval status');
    } else {
        console.log('\n⚠️  SOME TESTS FAILED');
        console.log('\nResults:');
        Object.entries(results).forEach(([key, value]) => {
            console.log(`  ${value ? '✅' : '❌'} ${key}`);
        });
    }

    console.log('\n' + '='.repeat(70));
}

// Run the test
runCompleteTest().catch(err => {
    console.error('\n💥 Unexpected error:', err.message);
    process.exit(1);
});
