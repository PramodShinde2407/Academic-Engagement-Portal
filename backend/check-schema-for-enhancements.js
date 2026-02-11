import { db } from './src/config/db.js';

async function checkDatabaseSchema() {
    console.log('🔍 Checking Database Schema for Club Registration Enhancements\n');

    try {
        // 1. Check club_application table
        console.log('1. CLUB_APPLICATION Table:');
        const [appColumns] = await db.query(`
            SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'college_db' 
            AND TABLE_NAME = 'club_application'
            ORDER BY ORDINAL_POSITION
        `);

        console.log('   Current columns:');
        appColumns.forEach(col => {
            console.log(`   - ${col.COLUMN_NAME} (${col.DATA_TYPE})`);
        });

        const requiredFields = ['full_name', 'personal_email', 'college_email', 'roll_no', 'year', 'division', 'department', 'photo_url', 'phone_no'];
        const existingFields = appColumns.map(c => c.COLUMN_NAME);
        const missingFields = requiredFields.filter(f => !existingFields.includes(f));

        if (missingFields.length > 0) {
            console.log('\n   ⚠️  Missing fields:', missingFields.join(', '));
        } else {
            console.log('\n   ✅ All required fields present');
        }

        // 2. Check club_interest table
        console.log('\n2. CLUB_INTEREST Table:');
        const [interestTables] = await db.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = 'college_db' 
            AND TABLE_NAME = 'club_interest'
        `);

        if (interestTables.length > 0) {
            const [interestColumns] = await db.query(`
                SELECT COLUMN_NAME, DATA_TYPE
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = 'college_db' 
                AND TABLE_NAME = 'club_interest'
                ORDER BY ORDINAL_POSITION
            `);
            console.log('   ✅ Table exists with columns:');
            interestColumns.forEach(col => {
                console.log(`   - ${col.COLUMN_NAME} (${col.DATA_TYPE})`);
            });
        } else {
            console.log('   ❌ Table does not exist - needs to be created');
        }

        // 3. Check club table
        console.log('\n3. CLUB Table:');
        const [clubColumns] = await db.query(`
            SELECT COLUMN_NAME, DATA_TYPE
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'college_db' 
            AND TABLE_NAME = 'club'
            ORDER BY ORDINAL_POSITION
        `);
        console.log('   Columns:');
        clubColumns.forEach(col => {
            console.log(`   - ${col.COLUMN_NAME} (${col.DATA_TYPE})`);
        });

        const hasClubMentor = clubColumns.some(c => c.COLUMN_NAME === 'club_mentor_id');
        if (hasClubMentor) {
            console.log('\n   ✅ club_mentor_id column exists');
        } else {
            console.log('\n   ⚠️  club_mentor_id column missing - needs to be added');
        }

        // 4. Check roles
        console.log('\n4. ROLES:');
        const [roles] = await db.query('SELECT role_id, role_name FROM role ORDER BY role_id');
        console.log('   Available roles:');
        roles.forEach(role => {
            console.log(`   - ${role.role_id}: ${role.role_name}`);
        });

        const hasClubMentorRole = roles.some(r => r.role_name.toLowerCase().includes('mentor'));
        if (hasClubMentorRole) {
            console.log('\n   ✅ Club mentor role exists');
        } else {
            console.log('\n   ⚠️  Club mentor role may need to be verified');
        }

        console.log('\n✅ Schema check complete!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await db.end();
    }
}

checkDatabaseSchema();
