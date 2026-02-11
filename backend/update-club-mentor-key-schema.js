import { db } from './src/config/db.js';

async function updateClubMentorKeySchema() {
    try {
        console.log('\n🔄 Updating database schema for club mentor key system...\n');
        console.log('═'.repeat(60));

        // Check if club_mentor_key column exists in club table
        const [clubColumns] = await db.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'college_db' 
            AND TABLE_NAME = 'club' 
            AND COLUMN_NAME = 'club_mentor_key'
        `);

        if (clubColumns.length === 0) {
            console.log('\n📝 Adding club_mentor_key column to club table...');
            await db.query('ALTER TABLE club ADD COLUMN club_mentor_key VARCHAR(100) UNIQUE');
            console.log('   ✅ Column added to club table\n');
        } else {
            console.log('\n   ℹ️  club_mentor_key column already exists in club table\n');
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

updateClubMentorKeySchema();
