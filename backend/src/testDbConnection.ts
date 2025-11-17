// backend/src/testDbConnection.ts
import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DIRECT_URL is not defined in your .env file.');
  process.exit(1);
}

console.log('Attempting to connect to the database...');
console.log(`Using connection string: ${connectionString.replace(/:[^:]+@/, ':********@')}`); // Hide password

const client = new Client({
  connectionString: connectionString,
});

async function testConnection() {
  try {
    await client.connect();
    console.log('✅ Success! Database connection established.');
    const res = await client.query('SELECT NOW()');
    console.log('Current time from database:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Error: Failed to connect to the database.');
    if (err instanceof Error) {
        console.error('Error details:', err.message);
    } else {
        console.error('An unknown error occurred:', err);
    }
  } finally {
    await client.end();
    console.log('Connection closed.');
  }
}

testConnection();
