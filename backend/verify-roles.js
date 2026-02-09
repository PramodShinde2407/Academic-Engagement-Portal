import mysql from 'mysql2/promise';

async function verifyNewRoles() {
    console.log('🔍 Verifying New Roles Setup\n');
    console.log('='.repeat(80));

    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'pict@123',
            database: 'college_db'
        });

        // Check all roles
        console.log('\n📋 All Roles in Database:\n');
        const [roles] = await conn.query('SELECT * FROM role ORDER BY role_id');
        console.table(roles);

        // Check all key tables
        console.log('\n🔑 Key Tables Status:\n');

        const tables = [
            'admin_key',
            'faculty_key',
            'club_mentor_key',
            'estate_manager_key',
            'principal_key',
            'director_key'
        ];

        for (const table of tables) {
            try {
                const [keys] = await conn.query(`SELECT * FROM ${table}`);
                console.log(`✅ ${table}: ${keys.length} key(s) available`);
                keys.forEach(k => {
                    const usedInfo = k.used !== undefined ? ` (used: ${k.used})` : '';
                    console.log(`   - ${k.key_value}${usedInfo}`);
                });
            } catch (err) {
                console.log(`❌ ${table}: Table does not exist`);
            }
        }

        console.log('\n' + '='.repeat(80));
        console.log('\n✅ Verification Complete!\n');

        await conn.end();

    } catch (err) {
        console.log('❌ Error:', err.message);
    }
}

verifyNewRoles();
