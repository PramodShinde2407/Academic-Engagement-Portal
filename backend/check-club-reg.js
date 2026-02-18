import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function showTableStructure() {
    let connection;

    try {
        console.log('Connecting to DB...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Current club_application structure:');
        const [columns] = await connection.query('DESCRIBE club_application');
        console.log(JSON.stringify(columns, null, 2));

        console.log('\nIndexes:');
        const [indexes] = await connection.query('SHOW INDEX FROM club_application');
        console.log(JSON.stringify(indexes, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Connection closed.');
        }
    }
}

showTableStructure();
