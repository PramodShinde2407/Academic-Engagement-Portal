import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkSystem() {
    let connection;

    try {
        console.log('🔍 Checking Event Registration System...\n');
        console.log('='.repeat(50));

        // 1. Database Connection
        console.log('\n1️⃣  Checking database connection...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        console.log('   ✅ Database connected');

        // 2. Check event_registration table
        console.log('\n2️⃣  Checking event_registration table...');
        const [tables] = await connection.query("SHOW TABLES LIKE 'event_registration'");
        if (tables.length === 0) {
            console.log('   ❌ Table does NOT exist!');
            console.log('   📝 Run: node create-event-table.js');
            process.exit(1);
        }
        console.log('   ✅ Table exists');

        // 3. Check table structure
        console.log('\n3️⃣  Checking table structure...');
        const [columns] = await connection.query('DESCRIBE event_registration');
        const requiredColumns = ['registration_id', 'event_id', 'student_id', 'full_name', 'email', 'phone', 'department', 'year', 'roll_no', 'notes', 'registered_at'];
        const existingColumns = columns.map(col => col.Field);

        let allColumnsExist = true;
        for (const col of requiredColumns) {
            if (!existingColumns.includes(col)) {
                console.log(`   ❌ Missing column: ${col}`);
                allColumnsExist = false;
            }
        }

        if (allColumnsExist) {
            console.log('   ✅ All required columns exist');
        } else {
            console.log('   ❌ Some columns are missing!');
            process.exit(1);
        }

        // 4. Check for events
        console.log('\n4️⃣  Checking for events...');
        const [events] = await connection.query('SELECT COUNT(*) as count FROM event');
        if (events[0].count === 0) {
            console.log('   ⚠️  No events found in database');
            console.log('   📝 Create some events first to test registration');
        } else {
            console.log(`   ✅ Found ${events[0].count} event(s)`);
        }

        // 5. Check for student users
        console.log('\n5️⃣  Checking for student users...');
        const [students] = await connection.query('SELECT COUNT(*) as count FROM user WHERE role_id = (SELECT role_id FROM role WHERE role_name = "Student")');
        if (students[0].count === 0) {
            console.log('   ⚠️  No student users found');
            console.log('   📝 Register some student users first');
        } else {
            console.log(`   ✅ Found ${students[0].count} student(s)`);
        }

        // 6. Check existing registrations
        console.log('\n6️⃣  Checking existing registrations...');
        const [registrations] = await connection.query('SELECT COUNT(*) as count FROM event_registration');
        console.log(`   ℹ️  Total registrations: ${registrations[0].count}`);

        // 7. Check recent registrations
        if (registrations[0].count > 0) {
            console.log('\n7️⃣  Recent registrations:');
            const [recent] = await connection.query(`
        SELECT 
          er.registration_id,
          e.title as event_name,
          er.full_name,
          er.email,
          DATE_FORMAT(er.registered_at, '%Y-%m-%d %H:%i:%s') as registered_at
        FROM event_registration er
        JOIN event e ON er.event_id = e.event_id
        ORDER BY er.registered_at DESC
        LIMIT 5
      `);
            console.table(recent);
        }

        // Final Summary
        console.log('\n' + '='.repeat(50));
        console.log('\n📊 SYSTEM STATUS SUMMARY:');
        console.log('='.repeat(50));
        console.log('✅ Database: Connected');
        console.log('✅ Table: event_registration exists');
        console.log('✅ Structure: All columns present');
        console.log(`ℹ️  Events: ${events[0].count}`);
        console.log(`ℹ️  Students: ${students[0].count}`);
        console.log(`ℹ️  Registrations: ${registrations[0].count}`);

        if (events[0].count > 0 && students[0].count > 0) {
            console.log('\n🎉 SYSTEM READY! You can now test event registration.');
            console.log('\n📝 Next steps:');
            console.log('   1. Open http://localhost:3000 in your browser');
            console.log('   2. Login as a student');
            console.log('   3. Navigate to Events');
            console.log('   4. Register for an event');
        } else {
            console.log('\n⚠️  SETUP INCOMPLETE:');
            if (events[0].count === 0) {
                console.log('   - Create some events first');
            }
            if (students[0].count === 0) {
                console.log('   - Register some student users first');
            }
        }

        console.log('\n' + '='.repeat(50));

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nFull error:', error);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkSystem();
