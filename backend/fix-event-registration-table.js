import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixEventRegistrationTable() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Fixing event_registration table...\n');

        // Drop the existing table if it exists
        console.log('1. Dropping existing table (if any)...');
        await connection.query('DROP TABLE IF EXISTS event_registration');
        console.log('   ✅ Old table dropped');

        // Create the table with correct structure
        console.log('\n2. Creating new table with correct structure...');
        await connection.query(`
      CREATE TABLE event_registration (
        registration_id INT PRIMARY KEY AUTO_INCREMENT,
        event_id INT NOT NULL,
        student_id INT NOT NULL,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        department VARCHAR(100),
        year INT,
        roll_no VARCHAR(50),
        notes TEXT,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (event_id) REFERENCES event(event_id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES user(user_id) ON DELETE CASCADE,
        
        UNIQUE KEY unique_event_registration (event_id, student_id)
      )
    `);
        console.log('   ✅ Table created successfully');

        // Verify the structure
        console.log('\n3. Verifying table structure...');
        const [columns] = await connection.query('DESCRIBE event_registration');
        console.table(columns);

        console.log('\n✅ event_registration table is now ready!');
        console.log('\n📝 Next step: Try registering for an event in the browser');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

fixEventRegistrationTable();
