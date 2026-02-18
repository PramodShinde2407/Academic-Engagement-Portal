import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

async function createEventRegistrationTable() {
    let connection;

    try {
        // Create connection
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME,
            multipleStatements: true
        });

        console.log('Connected to database...');

        // Read SQL file
        const sqlFile = path.join(__dirname, 'database', 'create-event-registration-table.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        // Execute SQL
        console.log('Creating event_registration table...');
        const [results] = await connection.query(sql);

        console.log('✅ event_registration table created successfully!');

        // Verify table exists
        const [tables] = await connection.query("SHOW TABLES LIKE 'event_registration'");
        if (tables.length > 0) {
            console.log('✅ Table verified in database');

            // Show table structure
            const [columns] = await connection.query('DESCRIBE event_registration');
            console.log('\nTable structure:');
            console.table(columns);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

createEventRegistrationTable();
