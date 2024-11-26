import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const t_category = pgTable('category', {
	id: serial('id').primaryKey().notNull(),
	name: text('name').notNull().unique(),
	created_at: timestamp('created_at').defaultNow().notNull()
});

export const t_user = pgTable('user', {
	id: serial('id').primaryKey().notNull(),
	username: text('username').notNull().unique(),
	password_hash: text('password_hash').notNull(),
	created_at: timestamp('created_at').defaultNow().notNull()
});

export const t_user_has_role = pgTable('user_has_role', {
	id: serial('id').primaryKey().notNull(),
	user_id: integer('user_id')
		.notNull()
		.references(() => t_user.id),
	role_id: integer('role_id')
		.notNull()
		.references(() => t_role.id)
});

export const t_role = pgTable('role', {
	id: serial('id').primaryKey().notNull(),
	name: text('name').notNull().unique()
});

export const t_product = pgTable('product', {
	id: serial('id').primaryKey().notNull(),
	name: text('name').notNull(),
	order_point: integer('order_point'),
	stock: integer('stock').default(0).notNull(),
	created_at: timestamp('created_at').defaultNow().notNull()
});
