import { db } from './src/config/db.js';

const runMigration = async () => {
    try {
        console.log('Adding approval columns to club_application table...');

        // Add head_approval_status
        try {
            await db.query(`
        ALTER TABLE club_application 
        ADD COLUMN head_approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending'
      `);
            console.log('Added head_approval_status column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('head_approval_status column already exists.');
            } else {
                throw e;
            }
        }

        // Add mentor_approval_status
        try {
            await db.query(`
        ALTER TABLE club_application 
        ADD COLUMN mentor_approval_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending'
      `);
            console.log('Added mentor_approval_status column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('mentor_approval_status column already exists.');
            } else {
                throw e;
            }
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
};

runMigration();
