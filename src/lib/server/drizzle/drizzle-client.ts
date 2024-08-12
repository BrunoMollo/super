import { DATABASE_URI } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import pg from 'pg';
import { dev } from '$app/environment';

const { Pool } = pg;

const pool = new Pool({
	connectionString: DATABASE_URI
});

export const db = drizzle(pool);
export type DB_Context = typeof db;

if (dev) {
	console.log('Running migrations (dev)');
	await migrate(db, { migrationsFolder: 'migrations', migrationsTable: 'my_migrations' });
}
