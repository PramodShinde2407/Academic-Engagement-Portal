import mysql from 'mysql2/promise';

async function setupNewRoleKeys() {
    console.log('🔧 Setting up new role keys...\n');

    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'pict@123',
            database: 'college_db'
        });

        // Create tables
        console.log('Creating key tables...');

        await conn.query(`
            CREATE TABLE IF NOT EXISTS club_mentor_key (
              key_id INT PRIMARY KEY AUTO_INCREMENT,
              key_value VARCHAR(100) UNIQUE NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS estate_manager_key (
              key_id INT PRIMARY KEY AUTO_INCREMENT,
              key_value VARCHAR(100) UNIQUE NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS principal_key (
              key_id INT PRIMARY KEY AUTO_INCREMENT,
              key_value VARCHAR(100) UNIQUE NOT NULL,
              used BOOLEAN DEFAULT 0,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await conn.query(`
            CREATE TABLE IF NOT EXISTS director_key (
              key_id INT PRIMARY KEY AUTO_INCREMENT,
              key_value VARCHAR(100) UNIQUE NOT NULL,
              used BOOLEAN DEFAULT 0,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Tables created successfully!\n');

        // Insert test keys
        console.log('Inserting test keys...');

        await conn.query(`INSERT IGNORE INTO club_mentor_key (key_value) VALUES ('CLUB_MENTOR_KEY_2024')`);
        await conn.query(`INSERT IGNORE INTO estate_manager_key (key_value) VALUES ('ESTATE_MANAGER_KEY_2024')`);
        await conn.query(`INSERT IGNORE INTO principal_key (key_value, used) VALUES ('PRINCIPAL_KEY_2024', 0)`);
        await conn.query(`INSERT IGNORE INTO director_key (key_value, used) VALUES ('DIRECTOR_KEY_2024', 0)`);

        console.log('✅ Test keys inserted!\n');

        // Display all keys
        console.log('='.repeat(70));
        console.log('\n📋 Available Test Keys:\n');

        const [mentorKeys] = await conn.query('SELECT * FROM club_mentor_key');
        console.log('Club Mentor Keys:');
        mentorKeys.forEach(k => console.log(`  - ${k.key_value}`));

        const [estateKeys] = await conn.query('SELECT * FROM estate_manager_key');
        console.log('\nEstate Manager Keys:');
        estateKeys.forEach(k => console.log(`  - ${k.key_value}`));

        const [principalKeys] = await conn.query('SELECT * FROM principal_key');
        console.log('\nPrincipal Keys:');
        principalKeys.forEach(k => console.log(`  - ${k.key_value} (used: ${k.used})`));

        const [directorKeys] = await conn.query('SELECT * FROM director_key');
        console.log('\nDirector Keys:');
        directorKeys.forEach(k => console.log(`  - ${k.key_value} (used: ${k.used})`));

        console.log('\n' + '='.repeat(70));
        console.log('\n✅ Setup complete! You can now register users with these roles.\n');

        await conn.end();

    } catch (err) {
        console.log('❌ Error:', err.message);
    }
}

setupNewRoleKeys();
