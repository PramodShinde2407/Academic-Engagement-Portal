// fix-event-clubs.js
// Run with: node fix-event-clubs.js
import dotenv from 'dotenv';
dotenv.config();

import { db } from './src/config/db.js';

async function fixEventClubs() {
    try {
        console.log('🔧 Fixing event club associations...\n');

        // Fix AWS events (organizer_id = 21 = AWS Club Head, club_id = 20)
        const [awsResult] = await db.query(
            "UPDATE event SET club_id = 20 WHERE organizer_id = 21 AND (club_id IS NULL OR club_id != 20)"
        );
        console.log(`✅ AWS events fixed: ${awsResult.affectedRows} rows updated (club_id → 20)`);

        // Fix CSI events (organizer_id = 15 = CSI Head, club_id = 19)
        const [csiResult] = await db.query(
            "UPDATE event SET club_id = 19 WHERE organizer_id = 15 AND (club_id IS NULL OR club_id != 19)"
        );
        console.log(`✅ CSI events fixed: ${csiResult.affectedRows} rows updated (club_id → 19)`);

        // Fix Sports Meet (event_id = 10, should be Sports Club = 7)
        const [sportsResult] = await db.query(
            "UPDATE event SET club_id = 7 WHERE event_id = 10"
        );
        console.log(`✅ Sports Meet fixed: ${sportsResult.affectedRows} rows updated (club_id → 7)`);

        // Verify
        console.log('\n📋 Verification - Current event-club mapping:');
        const [events] = await db.query(`
      SELECT e.event_id, e.title, e.club_id, c.name AS club_name, e.organizer_id
      FROM event e
      LEFT JOIN club c ON c.club_id = e.club_id
      ORDER BY e.event_id DESC
      LIMIT 20
    `);
        events.forEach(e => {
            const status = e.club_id ? '✅' : '❌ NULL';
            console.log(`  ${status} Event ${e.event_id}: "${e.title}" → Club: ${e.club_name || 'NONE'} (club_id=${e.club_id})`);
        });

        console.log('\n✅ Done!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

fixEventClubs();
