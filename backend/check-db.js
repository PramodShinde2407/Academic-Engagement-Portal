import mysql from "mysql2/promise";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from current directory
dotenv.config({ path: join(__dirname, '.env') });

async function checkDatabase() {
    console.log('🔍 Checking database connection...\n');
    console.log('Environment variables loaded:');
    console.log(`DB_HOST: ${process.env.DB_HOST || 'NOT SET'}`);
    console.log(`DB_USER: ${process.env.DB_USER || 'NOT SET'}`);
    console.log(`DB_PASS: ${process.env.DB_PASS ? '***' + process.env.DB_PASS.slice(-2) : 'NOT SET'}`);
    console.log(`DB_NAME: ${process.env.DB_NAME || 'NOT SET'}\n`);

    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        console.log('✅ Successfully connected to database!\n');

        // Check roles
        const [roles] = await conn.query('SELECT * FROM role ORDER BY role_id');

        console.log('📋 ROLES IN DATABASE:');
        console.log('═'.repeat(60));
        if (roles.length === 0) {
            console.log('⚠️  No roles found in the database!');
        } else {
            roles.forEach(role => {
                console.log(`  Role ID: ${role.role_id} | Role Name: "${role.role_name}"`);
            });
        }
        console.log('═'.repeat(60));

        // Check if Faculty or Teacher exists
        const hasFaculty = roles.some(r => r.role_name === 'Faculty');
        const hasTeacher = roles.some(r => r.role_name === 'Teacher');

        console.log('\n🔍 Analysis:');
        if (hasFaculty) {
            console.log('  ✓ "Faculty" role EXISTS in database');
        }
        if (hasTeacher) {
            console.log('  ✓ "Teacher" role EXISTS in database');
        }
        if (!hasFaculty && !hasTeacher) {
            console.log('  ⚠️  Neither "Faculty" nor "Teacher" role found!');
        }

        await conn.end();
    } catch (err) {
        console.error('❌ Database Error:');
        console.error(`   Code: ${err.code}`);
        console.error(`   Message: ${err.message}`);

        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 Fix: Check your DB_PASS in the .env file');
        } else if (err.code === 'ECONNREFUSED') {
            console.log('\n💡 Fix: Make sure MySQL server is running');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.log('\n💡 Fix: Database "college_db" does not exist. Run the schema.sql file first.');
        }
    }
}

checkDatabase();
