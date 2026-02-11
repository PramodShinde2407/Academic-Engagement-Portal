import { db } from './src/config/db.js';

async function updatePermissionEmailSchema() {
    try {
        console.log('\n🔄 Updating database schema for permission emails...\n');
        console.log('═'.repeat(60));

        // Check if permission_emails column exists in club table
        const [clubColumns] = await db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'college_db' 
            AND TABLE_NAME = 'club' 
            AND COLUMN_NAME = 'permission_emails'
        `);

        if (clubColumns.length === 0) {
            console.log('\n📝 Adding permission_emails column to club table...');
            await db.query('ALTER TABLE club ADD COLUMN permission_emails TEXT');
            console.log('   ✅ Column added to club table\n');
        } else {
            console.log('\n   ℹ️  permission_emails column already exists in club table\n');
        }

        // Check if event table exists
        const [eventTables] = await db.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = 'college_db' 
            AND TABLE_NAME = 'event'
        `);

        if (eventTables.length > 0) {
            // Check if permission_emails column exists in event table
            const [eventColumns] = await db.query(`
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_SCHEMA = 'college_db' 
                AND TABLE_NAME = 'event' 
                AND COLUMN_NAME = 'permission_emails'
            `);

            if (eventColumns.length === 0) {
                console.log('📝 Adding permission_emails column to event table...');
                await db.query('ALTER TABLE event ADD COLUMN permission_emails TEXT');
                console.log('   ✅ Column added to event table\n');
            } else {
                console.log('   ℹ️  permission_emails column already exists in event table\n');
            }
        } else {
            console.log('   ℹ️  Event table does not exist, skipping...\n');
        }

        console.log('═'.repeat(60));
        console.log('\n✅ Schema update completed successfully!\n');

        // Show club table structure
        console.log('📋 Club table columns:');
        const [clubStructure] = await db.query('DESCRIBE club');
        clubStructure.forEach(col => {
            console.log(`   - ${col.Field} (${col.Type})`);
        });
        console.log('');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await db.end();
    }
}

updatePermissionEmailSchema();
