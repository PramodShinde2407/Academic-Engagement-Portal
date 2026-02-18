import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testEventRegistration() {
    let connection;

    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('Testing event registration flow...\n');

        // 1. Check if we have any events
        const [events] = await connection.query('SELECT event_id, title FROM event LIMIT 1');

        if (events.length === 0) {
            console.log('❌ No events found in database. Please create an event first.');
            process.exit(1);
        }

        console.log('✅ Found event:', events[0]);
        const eventId = events[0].event_id;

        // 2. Check if we have any users
        const [users] = await connection.query('SELECT user_id, name, email FROM user WHERE role_id = (SELECT role_id FROM role WHERE role_name = "Student") LIMIT 1');

        if (users.length === 0) {
            console.log('❌ No student users found in database.');
            process.exit(1);
        }

        console.log('✅ Found user:', users[0]);
        const userId = users[0].user_id;

        // 3. Try to insert a test registration
        console.log('\nAttempting to register user for event...');

        try {
            await connection.query(
                `INSERT INTO event_registration 
        (event_id, student_id, full_name, email, phone, department, year, roll_no, notes) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [eventId, userId, 'Test User', 'test@example.com', '1234567890', 'Computer Science', 2, 'CS123', 'Test registration']
            );

            console.log('✅ Registration successful!');

            // 4. Verify the registration
            const [registrations] = await connection.query(
                'SELECT * FROM event_registration WHERE event_id = ? AND student_id = ?',
                [eventId, userId]
            );

            console.log('\nRegistration details:');
            console.table(registrations);

            // 5. Clean up test data
            console.log('\nCleaning up test registration...');
            await connection.query(
                'DELETE FROM event_registration WHERE event_id = ? AND student_id = ?',
                [eventId, userId]
            );
            console.log('✅ Test data cleaned up');

        } catch (insertError) {
            if (insertError.code === 'ER_DUP_ENTRY') {
                console.log('⚠️  User is already registered for this event');

                // Show existing registration
                const [existing] = await connection.query(
                    'SELECT * FROM event_registration WHERE event_id = ? AND student_id = ?',
                    [eventId, userId]
                );
                console.log('\nExisting registration:');
                console.table(existing);
            } else {
                throw insertError;
            }
        }

        console.log('\n✅ Event registration system is working correctly!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

testEventRegistration();
