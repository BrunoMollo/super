/**
 * THIS FILE IS FOR TESTING THE BUILD ONLY
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const pg_client = postgres('postgresql://postgres:postgres@localhost:5432/db', { prepare: false });

const db = drizzle(pg_client);
await migrate(db, { migrationsFolder: 'migrations' });
