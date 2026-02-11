import { db } from './src/config/db.js';

async function checkColumnExists(tableName, columnName) {
    const [rows] = await db.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.columns 
        WHERE table_schema = DATABASE()
        AND table_name = ?
        AND column_name = ?
    `, [tableName, columnName]);
    return rows[0].count > 0;
}

async function executeDatabaseUpdates() {
    console.log('🔧 Executing Database Schema Updates...\n');

    try {
        // 1. Add columns to club_application
        console.log('1. Updating club_application table...');

        if (!(await checkColumnExists('club_application', 'roll_no'))) {
            await db.query(`
                ALTER TABLE club_application
                ADD COLUMN roll_no VARCHAR(50) AFTER college_email
            `);
            console.log('   ✅ Added roll_no column');
        } else {
            console.log('   ℹ️  roll_no column already exists');
        }

        if (!(await checkColumnExists('club_application', 'division'))) {
            await db.query(`
                ALTER TABLE club_application
                ADD COLUMN division VARCHAR(10) AFTER year
            `);
            console.log('   ✅ Added division column');
        } else {
            console.log('   ℹ️  division column already exists');
        }

        if (!(await checkColumnExists('club_application', 'phone_no'))) {
            await db.query(`
                ALTER TABLE club_application
                ADD COLUMN phone_no VARCHAR(15) AFTER division
            `);
            console.log('   ✅ Added phone_no column');
        } else {
            console.log('   ℹ️  phone_no column already exists');
        }

        // 2. Add club_mentor_id to club table
        console.log('\n2. Updating club table...');

        if (!(await checkColumnExists('club', 'club_mentor_id'))) {
            await db.query(`
                ALTER TABLE club 
                ADD COLUMN club_mentor_id INT AFTER club_head_id
            `);
            console.log('   ✅ Added club_mentor_id column');

            await db.query(`
                ALTER TABLE club 
                ADD CONSTRAINT fk_club_mentor 
                FOREIGN KEY (club_mentor_id) REFERENCES user(user_id) ON DELETE SET NULL
            `);
            console.log('   ✅ Added foreign key constraint');
        } else {
            console.log('   ℹ️  club_mentor_id column already exists');
        }

        // 3. Verify changes
        console.log('\n3. Verifying changes...');

        const [appCols] = await db.query(`
            SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'club_application'
            ORDER BY ORDINAL_POSITION
        `);
        console.log('   club_application columns:', appCols.map(c => c.COLUMN_NAME).join(', '));

        const [clubCols] = await db.query(`
            SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = DATABASE()
            AND TABLE_NAME = 'club'
            ORDER BY ORDINAL_POSITION
        `);
        console.log('   club columns:', clubCols.map(c => c.COLUMN_NAME).join(', '));

        console.log('\n✅ Database schema updates completed successfully!');

    } catch (error) {
        console.error('❌ Error updating database:', error.message);
        console.error('Full error:', error);
        throw error;
    } finally {
        await db.end();
    }
}

executeDatabaseUpdates();
