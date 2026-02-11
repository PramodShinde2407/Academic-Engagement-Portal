import { db } from './src/config/db.js';

async function getAdminKeys() {
    try {
        const [rows] = await db.query('SELECT * FROM admin_key');
        console.log('\n📋 Admin Keys in Database:\n');
        console.log('═'.repeat(50));

        if (rows.length === 0) {
            console.log('❌ No admin keys found in database');
        } else {
            rows.forEach((row, index) => {
                console.log(`\n${index + 1}. Key: ${row.key_value}`);
                console.log(`   Used: ${row.used ? '✅ Yes (Already used)' : '❌ No (Available)'}`);
                console.log(`   ID: ${row.id}`);
            });
        }

        console.log('\n' + '═'.repeat(50));
        console.log('\n💡 To register as Admin, use an unused key during signup\n');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await db.end();
    }
}

getAdminKeys();
