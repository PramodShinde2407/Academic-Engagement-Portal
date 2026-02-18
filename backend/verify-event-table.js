import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function verifyTable() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Checking event_registration table...\n');

        // Check if table exists
        const [tables] = await connection.query("SHOW TABLES LIKE 'event_registration'");

        if (tables.length === 0) {
            console.log('❌ Table does NOT exist!');
            process.exit(1);
        }

        console.log('✅ Table exists!\n');

        // Show table structure
        const [columns] = await connection.query('DESCRIBE event_registration');
        console.log('Table Structure:');
        console.table(columns);

        // Check if there are any registrations
        const [count] = await connection.query('SELECT COUNT(*) as count FROM event_registration');
        console.log(`\nTotal registrations: ${count[0].count}`);

        // Check if there are any events
        const [events] = await connection.query('SELECT event_id, title FROM event LIMIT 5');
        console.log('\nAvailable events:');
        console.table(events);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

verifyTable();
