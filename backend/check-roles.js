import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function checkRoles() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'college_db'
    });

    console.log('✅ Connected to database\n');
    
    const [roles] = await conn.query('SELECT * FROM role ORDER BY role_id');
    
    console.log('📋 Roles in database:');
    console.log('━'.repeat(50));
    roles.forEach(role => {
      console.log(`Role ID: ${role.role_id} | Role Name: "${role.role_name}"`);
    });
    console.log('━'.repeat(50));
    
    await conn.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n💡 Make sure your .env file has the correct database credentials:');
    console.log('   DB_HOST=localhost');
    console.log('   DB_USER=root');
    console.log('   DB_PASS=your_password');
    console.log('   DB_NAME=college_db');
  }
}

checkRoles();
