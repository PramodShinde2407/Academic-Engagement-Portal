import { db } from './src/config/db.js';

console.log('🔍 Checking Club Head Status\n');
console.log('='.repeat(70));

async function checkClubHead() {
    try {
        // Check club data
        const [clubs] = await db.query('SELECT * FROM club');

        console.log('\n📊 Club Status:');
        if (clubs.length === 0) {
            console.log('❌ NO CLUBS FOUND in database!');
        } else {
            clubs.forEach(club => {
                console.log(`\n  Club: ${club.name}`);
                console.log(`  Secret Key: ${club.secret_key}`);
                console.log(`  Club Head ID: ${club.club_head_id || '❌ NOT ASSIGNED (null)'}`);

                if (club.club_head_id) {
                    console.log(`  ✅ Club Head is assigned`);
                } else {
                    console.log(`  ℹ️  Club Head can be registered using key: ${club.secret_key}`);
                }
            });
        }

        // Check if there are any users with Club Head role
        const [clubHeads] = await db.query(`
      SELECT u.user_id, u.name, u.email, r.role_name 
      FROM user u 
      JOIN role r ON u.role_id = r.role_id 
      WHERE r.role_name = 'Club Head'
    `);

        console.log('\n\n👥 Users with Club Head role:');
        if (clubHeads.length === 0) {
            console.log('  ❌ No Club Heads registered yet');
        } else {
            clubHeads.forEach(ch => {
                console.log(`  - ${ch.name} (${ch.email}) - ID: ${ch.user_id}`);
            });
        }

        console.log('\n' + '='.repeat(70));
        console.log('✅ Check complete!');

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

checkClubHead();
