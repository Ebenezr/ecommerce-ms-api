import { DATABASE_URL } from './src/config/index';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

async function runMigration() {
  try {
    console.log('Running migration');
    const pool = new Pool({
      connectionString: DATABASE_URL,
    });
    const db = drizzle(pool);
    await migrate(db, {
      migrationsFolder: './src/db/migrations',
    });
    console.log('Migration completed');
    pool.end();
  } catch (err) {
    console.error('migration error', err);
  }
}

runMigration();
