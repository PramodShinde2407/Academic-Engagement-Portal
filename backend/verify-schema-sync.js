import { db } from './src/config/db.js';

async function verifyDatabaseSchema() {
    console.log('🔍 Verifying Database Schema...\n');

    try {
        // Check notification table structure
        console.log('1. Checking NOTIFICATION table...');
        const [notificationColumns] = await db.query(`
            SELECT COLUMN_NAME, DATA_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'college_db' 
            AND TABLE_NAME = 'notification'
            ORDER BY ORDINAL_POSITION
        `);

        const requiredNotificationCols = ['notification_id', 'user_id', 'title', 'message', 'type', 'link', 'is_read', 'created_at'];
        const foundNotificationCols = notificationColumns.map(c => c.COLUMN_NAME);

        console.log('   Found columns:', foundNotificationCols.join(', '));
        const missingNotificationCols = requiredNotificationCols.filter(col => !foundNotificationCols.includes(col));

        if (missingNotificationCols.length === 0) {
            console.log('   ✅ All required columns present\n');
        } else {
            console.log('   ❌ Missing columns:', missingNotificationCols.join(', '), '\n');
        }

        // Check club_application table structure
        console.log('2. Checking CLUB_APPLICATION table...');
        const [applicationColumns] = await db.query(`
            SELECT COLUMN_NAME, DATA_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'college_db' 
            AND TABLE_NAME = 'club_application'
            ORDER BY ORDINAL_POSITION
        `);

        const requiredApplicationCols = ['application_id', 'club_id', 'user_id', 'full_name', 'personal_email', 'college_email', 'department', 'year', 'statement_of_purpose', 'photo_url', 'status', 'applied_at'];
        const foundApplicationCols = applicationColumns.map(c => c.COLUMN_NAME);

        console.log('   Found columns:', foundApplicationCols.join(', '));
        const missingApplicationCols = requiredApplicationCols.filter(col => !foundApplicationCols.includes(col));

        if (missingApplicationCols.length === 0) {
            console.log('   ✅ All required columns present\n');
        } else {
            console.log('   ❌ Missing columns:', missingApplicationCols.join(', '), '\n');
        }

        // Check club table for is_registration_open
        console.log('3. Checking CLUB table...');
        const [clubColumns] = await db.query(`
            SELECT COLUMN_NAME, DATA_TYPE 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'college_db' 
            AND TABLE_NAME = 'club'
            AND COLUMN_NAME = 'is_registration_open'
        `);

        if (clubColumns.length > 0) {
            console.log('   ✅ is_registration_open column exists\n');
        } else {
            console.log('   ❌ is_registration_open column missing\n');
        }

        // Verify old tables are removed
        console.log('4. Checking for old duplicate tables...');
        const [oldTables] = await db.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = 'college_db' 
            AND TABLE_NAME IN ('club_registrations', 'notifications')
        `);

        if (oldTables.length === 0) {
            console.log('   ✅ Old duplicate tables removed\n');
        } else {
            console.log('   ⚠️  Old tables still exist:', oldTables.map(t => t.TABLE_NAME).join(', '), '\n');
        }

        console.log('✅ Database schema verification complete!');

    } catch (error) {
        console.error('❌ Verification failed:', error.message);
    } finally {
        await db.end();
    }
}

verifyDatabaseSchema();
