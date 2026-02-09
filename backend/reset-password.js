import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function resetUserPassword() {
    console.log('🔐 Password Reset Tool\n');
    console.log('='.repeat(70));

    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'pict@123',
            database: 'college_db'
        });

        // Get all users
        const [users] = await conn.query(`
            SELECT u.user_id, u.name, u.email, r.role_name
            FROM user u
            JOIN role r ON u.role_id = r.role_id
            ORDER BY u.user_id
        `);

        console.log(`\n📊 Registered users:\n`);
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.role_name}`);
        });

        console.log('\n' + '='.repeat(70));

        const userNum = await question('\nEnter user number to reset password (or 0 to exit): ');
        const selectedIndex = parseInt(userNum) - 1;

        if (selectedIndex < 0 || selectedIndex >= users.length) {
            console.log('Exiting...');
            rl.close();
            await conn.end();
            return;
        }

        const selectedUser = users[selectedIndex];
        console.log(`\nResetting password for: ${selectedUser.name} (${selectedUser.email})`);

        const newPassword = await question('Enter new password: ');

        if (!newPassword || newPassword.length < 6) {
            console.log('❌ Password must be at least 6 characters!');
            rl.close();
            await conn.end();
            return;
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        await conn.query(
            'UPDATE user SET password_hash = ? WHERE user_id = ?',
            [hashedPassword, selectedUser.user_id]
        );

        console.log('\n✅ Password reset successful!');
        console.log(`\nYou can now login with:`);
        console.log(`   Email: ${selectedUser.email}`);
        console.log(`   Password: ${newPassword}`);

        rl.close();
        await conn.end();

    } catch (err) {
        console.log('\n❌ Error:', err.message);
        rl.close();
    }
}

resetUserPassword();
