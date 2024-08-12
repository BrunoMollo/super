import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const t_category = pgTable('category', {
	id: serial('id').primaryKey().notNull(),
	name: text('name').notNull().unique(),
	created_at: timestamp('created_at').defaultNow().notNull()
});
