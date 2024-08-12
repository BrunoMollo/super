import * as dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

const { DATABASE_URI } = process.env;
if (!DATABASE_URI) {
	throw new Error('Define DATABASE_URL in .env file');
}

export default {
	dialect: 'postgresql',
	schema: './src/lib/server/drizzle/schema.ts',
	out: 'migrations',
	dbCredentials: {
		url: DATABASE_URI
	}
} satisfies Config;
