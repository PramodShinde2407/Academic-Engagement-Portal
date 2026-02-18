import mysql from 'mysql2/promise';

async function testClubHeadRole() {
    console.log('🔍 Testing Club Head Role Setup\n');
    console.log('='.repeat(60));

    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'pict@123',
            database: 'college_db'
        });

        // Check Club Head role
        console.log('\n1️⃣  Checking Club Head Role:');
        const [roles] = await conn.query('SELECT * FROM role WHERE role_name = "Club Head"');
        console.log('Club Head Role:', JSON.stringify(roles, null, 2));

        // Check users with Club Head role
        console.log('\n2️⃣  Checking Users with Club Head Role:');
        const [users] = await conn.query(`
            SELECT u.user_id, u.name, u.email, u.role_id, r.role_name 
            FROM user u 
            JOIN role r ON u.role_id = r.role_id 
            WHERE r.role_name = "Club Head"
        `);
        console.log('Club Head Users:', JSON.stringify(users, null, 2));

        // Check clubs with club_head_id
        console.log('\n3️⃣  Checking Clubs with Club Heads:');
        const [clubs] = await conn.query(`
            SELECT c.club_id, c.name, c.club_head_id, u.name as club_head_name, u.email as club_head_email
            FROM club c
            LEFT JOIN user u ON c.club_head_id = u.user_id
            WHERE c.club_head_id IS NOT NULL
        `);
        console.log('Clubs with Club Heads:', JSON.stringify(clubs, null, 2));

        await conn.end();

        console.log('\n' + '='.repeat(60));
        console.log('\n✅ Test Complete!\n');

    } catch (err) {
        console.log('\n❌ Error:', err.message);
        console.log(err.stack);
    }
}

testClubHeadRole();
