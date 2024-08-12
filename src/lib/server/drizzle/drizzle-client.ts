import { DATABASE_URI } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { dev } from '$app/environment';

const pg_client = postgres(DATABASE_URI, { prepare: false });

export const db = drizzle(pg_client);
export type DB_Context = typeof db;

if (dev) {
	console.log('Running migrations (dev)');
	await migrate(db, { migrationsFolder: 'migrations', migrationsTable: 'my_migrations' });
}
