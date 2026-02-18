import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function showTableStructure() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Current event_registration table structure:\n');
        const [columns] = await connection.query('DESCRIBE event_registration');
        console.table(columns);

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

showTableStructure();
