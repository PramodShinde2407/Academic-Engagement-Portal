import mysql from 'mysql2/promise';

async function setupPermissionSystem() {
    console.log('🔧 Setting up Permission System Database...\n');
    console.log('='.repeat(70));

    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'pict@123',
            database: 'college_db'
        });

        console.log('\n✅ Connected to database\n');

        // Create permission_request table
        console.log('Creating permission_request table...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS permission_request (
              request_id INT PRIMARY KEY AUTO_INCREMENT,
              club_head_id INT NOT NULL,
              club_id INT,
              
              subject VARCHAR(200) NOT NULL,
              description TEXT NOT NULL,
              location VARCHAR(150) NOT NULL,
              event_date DATE NOT NULL,
              start_time TIME NOT NULL,
              end_time TIME NOT NULL,
              
              current_status ENUM(
                'pending_club_mentor',
                'pending_estate_manager',
                'pending_principal',
                'pending_director',
                'approved',
                'rejected'
              ) DEFAULT 'pending_club_mentor',
              
              current_approver_role VARCHAR(50) DEFAULT 'Club Mentor',
              
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
              
              FOREIGN KEY (club_head_id) REFERENCES user(user_id) ON DELETE CASCADE,
              FOREIGN KEY (club_id) REFERENCES club(club_id) ON DELETE SET NULL,
              
              INDEX idx_status (current_status),
              INDEX idx_club_head (club_head_id),
              INDEX idx_approver_role (current_approver_role)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ permission_request table created\n');

        // Create approval_action table
        console.log('Creating approval_action table...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS approval_action (
              action_id INT PRIMARY KEY AUTO_INCREMENT,
              request_id INT NOT NULL,
              
              approver_id INT NOT NULL,
              approver_role VARCHAR(50) NOT NULL,
              
              action ENUM('approved', 'rejected') NOT NULL,
              remarks TEXT,
              
              action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              
              FOREIGN KEY (request_id) REFERENCES permission_request(request_id) ON DELETE CASCADE,
              FOREIGN KEY (approver_id) REFERENCES user(user_id) ON DELETE CASCADE,
              
              INDEX idx_request (request_id),
              INDEX idx_approver (approver_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ approval_action table created\n');

        // Create notification table
        console.log('Creating notification table...');
        await conn.query(`
            CREATE TABLE IF NOT EXISTS notification (
              notification_id INT PRIMARY KEY AUTO_INCREMENT,
              user_id INT NOT NULL,
              request_id INT,
              
              message TEXT NOT NULL,
              type ENUM('approval_needed', 'approved', 'rejected', 'final_approval') DEFAULT 'approval_needed',
              is_read BOOLEAN DEFAULT 0,
              
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              
              FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
              FOREIGN KEY (request_id) REFERENCES permission_request(request_id) ON DELETE CASCADE,
              
              INDEX idx_user (user_id),
              INDEX idx_unread (user_id, is_read)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        `);
        console.log('✅ notification table created\n');

        console.log('='.repeat(70));
        console.log('\n✅ Permission System Database Setup Complete!\n');
        console.log('Tables created:');
        console.log('  1. permission_request');
        console.log('  2. approval_action');
        console.log('  3. notification\n');

        await conn.end();

    } catch (err) {
        console.log('\n❌ Error:', err.message);
        console.log('\nFull error:', err);
    }
}

setupPermissionSystem();
