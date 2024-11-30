import { DATABASE_URI } from '$env/static/private';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const pg_client = postgres(DATABASE_URI, { prepare: false });

export const db = drizzle(pg_client);
export type DB_Context = typeof db;
