import { bigint, integer, numeric, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

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
	desc: text('desc').unique().notNull(),
	order_point: integer('order_point').notNull(),
	stock: integer('stock').default(0).notNull(),
	bar_code: bigint('bar_code', { mode: 'number' }).unique().notNull(),
	created_at: timestamp('created_at').defaultNow().notNull()
});

export const t_product_has_category = pgTable('product_has_category', {
	product_id: integer('product_id')
		.notNull()
		.references(() => t_product.id),
	category_id: integer('category_id')
		.notNull()
		.references(() => t_category.id)
});

export const t_product_price = pgTable('product_price', {
	product_id: integer('product_id')
		.notNull()
		.references(() => t_product.id),
	price_amount: numeric('price_amount', { precision: 100, scale: 2 }).notNull(),
	date_from: timestamp('created_at').defaultNow().notNull()
});

export const t_sale = pgTable('sale', {
	id: serial('id').primaryKey().notNull(),
	seller_id: integer('seller_id')
		.notNull()
		.references(() => t_user.id),
	created_at: timestamp('created_at').defaultNow().notNull()
});

export const t_sale_line = pgTable('sale_line', {
	id: serial('id').primaryKey().notNull(),
	sale_id: integer('sale_id')
		.notNull()
		.references(() => t_sale.id),
	product_id: integer('product_id')
		.notNull()
		.references(() => t_product.id),
	quantity: integer('quantity').notNull(),
	unit_price: numeric('unit_price', { precision: 100, scale: 2 }).notNull()
});

export const t_client = pgTable('client', {
	id: serial('id').primaryKey().notNull(),
	dni: text('dni').notNull().unique(),
	email: text('email').notNull().unique(),
	first_name: text('first_name').notNull(),
	last_name: text('last_name').notNull(),
	created_at: timestamp('created_at').defaultNow().notNull()
});
