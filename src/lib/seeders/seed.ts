import { count } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';
import { Category_Repo_Drizzle } from '$lib/repos/category-repo-drizzle';
import { Client_Repo } from '$lib/repos/client-repo';
import { Product_Repo_Drizzle } from '$lib/repos/product-repo';
import { Role_Repo_Drizzle } from '$lib/repos/role-repo-drizzle';
import { User_Repo_Drizzle } from '$lib/repos/user-repo-drizzle';
import { db } from '$lib/server/drizzle/drizzle-client';
import {
	t_category,
	t_client,
	t_product,
	t_product_has_category,
	t_product_price,
	t_role,
	t_sale,
	t_sale_line,
	t_user,
	t_user_has_role
} from '$lib/server/drizzle/schema';
import { Hash_Service_Bcrypt } from '$lib/services/hash_service';
import { product_factory } from './factory/product-factory';

function title_seeder(thing: string) {
	console.log('-----------------------------------');
	console.log('|    Adding: ' + thing);
	console.log('-----------------------------------');
}
async function show_count(table: PgTable) {
	const { total } = await db
		.select({ total: count() })
		.from(table)
		.then((x) => x[0]);
	console.log('|    Total: ' + total);
	console.log('-----------------------------------');
}

async function seed_roles() {
	title_seeder('Roles');

	const repo = new Role_Repo_Drizzle(db);
	const ADMIN_ROLE_ID = await repo.create({ id: 1, name: 'ADMIN' });
	const SELLER_ROLE_ID = await repo.create({ id: 2, name: 'SELLER' });

	await show_count(t_role);
	return { ADMIN_ROLE_ID, SELLER_ROLE_ID };
}

async function seed_users(roles: Awaited<ReturnType<typeof seed_roles>>) {
	title_seeder('Users');
	const hash_service = new Hash_Service_Bcrypt();
	const repo = new User_Repo_Drizzle(db, hash_service);

	const ADMIN_ID = await repo.create({ username: 'bruno', password: '1234' });
	await repo.add_role({ user_id: ADMIN_ID, role_id: roles.ADMIN_ROLE_ID });

	const SELLER_ID = await repo.create({ username: 'rami', password: '1234' });
	await repo.add_role({ user_id: SELLER_ID, role_id: roles.SELLER_ROLE_ID });

	const ADMIN_SELLER_ID = await repo.create({ username: 'faus', password: '1234' });

	await repo.add_role({ user_id: ADMIN_SELLER_ID, role_id: roles.ADMIN_ROLE_ID });
	await repo.add_role({ user_id: ADMIN_SELLER_ID, role_id: roles.SELLER_ROLE_ID });

	await show_count(t_user);
	return { ADMIN_ID, SELLER_ID, ADMIN_SELLER_ID };
}

async function seed_categories() {
	title_seeder('Categories');
	const repo = new Category_Repo_Drizzle(db);
	const categories = {
		FRUTAS_Y_VERDURAS_ID: await repo.create({ name: 'Frutas y Verduras' }),
		CARNES_Y_PESCADOS_ID: await repo.create({ name: 'Carnes y Pescados' }),
		LACTEOS_Y_HUEVOS_ID: await repo.create({ name: 'Lácteos y Huevos' }),
		PANADERIA_Y_PASTELERIA_ID: await repo.create({ name: 'Panadería y Pastelería' }),
		BEBIDAS_ID: await repo.create({ name: 'Bebidas' }),
		SNACKS_Y_DULCES_ID: await repo.create({ name: 'Snacks y Dulces' }),
		LIMPIEZA_DEL_HOGAR_ID: await repo.create({ name: 'Limpieza del Hogar' }),
		CUIDADO_PERSONAL_ID: await repo.create({ name: 'Cuidado Personal' }),
		CONGELADOS_ID: await repo.create({ name: 'Congelados' }),
		COMIDAS_PREPARADAS_ID: await repo.create({ name: 'Comidas Preparadas' })
	};
	await show_count(t_category);
	return categories;
}

async function seed_products(categories: Awaited<ReturnType<typeof seed_categories>>) {
	title_seeder('Products');
	const repo = new Product_Repo_Drizzle(db);
	const products = {
		MANZANA_ROJA_ID: await repo.create(
			product_factory({
				desc: 'Manzana Roja',
				categories_ids: [categories.FRUTAS_Y_VERDURAS_ID]
			})
		),
		FILETE_DE_RES_ID: await repo.create(
			product_factory({
				desc: 'Filete de Res',
				categories_ids: [categories.CARNES_Y_PESCADOS_ID]
			})
		),
		LECHE_ENTERA_ID: await repo.create(
			product_factory({
				desc: 'Leche Entera',
				categories_ids: [categories.LACTEOS_Y_HUEVOS_ID]
			})
		),
		PAN_DE_MOLDE_INTEGRAL_ID: await repo.create(
			product_factory({
				desc: 'Pan de Molde Integral',
				categories_ids: [categories.PANADERIA_Y_PASTELERIA_ID]
			})
		),
		COCA_COLA_1L_ID: await repo.create(
			product_factory({
				desc: 'Coca-Cola 1L',
				categories_ids: [categories.BEBIDAS_ID]
			})
		),
		PAPAS_FRITAS_BOLSA_200G_ID: await repo.create(
			product_factory({
				desc: 'Papas Fritas Bolsa 200g',
				categories_ids: [categories.SNACKS_Y_DULCES_ID]
			})
		),
		DETERGENTE_LIQUIDO_1L_ID: await repo.create(
			product_factory({
				desc: 'Detergente Líquido 1L',
				categories_ids: [categories.LIMPIEZA_DEL_HOGAR_ID]
			})
		),
		SHAMPOO_ANTICASPA_500ML_ID: await repo.create(
			product_factory({
				desc: 'Shampoo Anticaspa 500ml',
				categories_ids: [categories.CUIDADO_PERSONAL_ID]
			})
		),
		PIZZA_CONGELADA_ID: await repo.create(
			product_factory({
				desc: 'Pizza Congelada',
				categories_ids: [categories.CONGELADOS_ID]
			})
		)
	};

	await show_count(t_product);
	return products;
}

async function seed_clients() {
	title_seeder('Clients');
	const repo = new Client_Repo(db);
	const clients = {
		MARIO_ID: await repo.create({
			dni: '20123123',
			email: 'mario@gmail.com',
			first_name: 'Mario',
			last_name: 'Bressano'
		})
	};
	await show_count(t_client);
	return clients;
}

async function seed() {
	console.log('\n------- Cleaning tables 🧹 -------');
	//eslint-disable-next-line drizzle/enforce-delete-with-where
	await db.delete(t_sale_line);
	//eslint-disable-next-line drizzle/enforce-delete-with-where
	await db.delete(t_sale);
	//eslint-disable-next-line drizzle/enforce-delete-with-where
	await db.delete(t_client);
	//eslint-disable-next-line drizzle/enforce-delete-with-where
	await db.delete(t_product_price);
	//eslint-disable-next-line drizzle/enforce-delete-with-where
	await db.delete(t_product_has_category);
	//eslint-disable-next-line drizzle/enforce-delete-with-where
	await db.delete(t_product);
	//eslint-disable-next-line drizzle/enforce-delete-with-where
	await db.delete(t_category);
	//eslint-disable-next-line drizzle/enforce-delete-with-where
	await db.delete(t_user_has_role);
	//eslint-disable-next-line drizzle/enforce-delete-with-where
	await db.delete(t_user);
	//eslint-disable-next-line drizzle/enforce-delete-with-where
	await db.delete(t_role);

	console.log('------- Tables deleted 🗑️ -------\n');

	const roles = await seed_roles();
	await seed_users(roles);
	const categories = await seed_categories();
	await seed_products(categories);
	await seed_clients();

	console.log('\n-----------------------------------');
	console.log('------- Seeding finished 🌱 -------');
	console.log('-----------------------------------');
}

// Main Seed
seed()
	.catch((err) => {
		console.error(err);
		process.exit(1);
	})
	.finally(() => {
		process.exit();
	});
