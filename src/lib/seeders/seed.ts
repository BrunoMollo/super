import { Category_Repo_Drizzle } from '$lib/repos/category-repo-drizzle';
import { Product_Repo_Drizzle } from '$lib/repos/product-repo';
import { Role_Repo_Drizzle } from '$lib/repos/role-repo-drizzle';
import { User_Repo_Drizzle } from '$lib/repos/user-repo-drizzle';
import { db } from '$lib/server/drizzle/drizzle-client';
import { t_category, t_product, t_role, t_user, t_user_has_role } from '$lib/server/drizzle/schema';
import { Hash_Service_Bcrypt } from '$lib/services/hash_service';

function title_seeder(thing: string) {
	console.log('-----------------------------------');
	console.log('|    Adding: ' + thing);
	console.log('-----------------------------------');
}

async function seed_roles() {
	title_seeder('Roles');

	const repo = new Role_Repo_Drizzle(db);
	const admin_id = await repo.create({ id: 1, name: 'ADMIN' });
	const seller_id = await repo.create({ id: 2, name: 'SELLER' });
	return { admin_id, seller_id };
}

async function seed_users(admin_id: number) {
	title_seeder('Users');
	const hash_service = new Hash_Service_Bcrypt();
	const repo = new User_Repo_Drizzle(db, hash_service);

	const admin_user = { username: 'bruno', password: '1234' };
	const user_id = await repo.create(admin_user).then((x) => x.id);
	await repo.add_role({ user_id, role_id: admin_id });
}

async function seed_categories() {
	title_seeder('Categories');
	const repo = new Category_Repo_Drizzle(db);
	await repo.create({ name: 'Lacteos' });
}

async function seed_products() {
	title_seeder('Products');
	const repo = new Product_Repo_Drizzle(db);
	await repo.create({ desc: 'Leche Milkaut', order_point: 10, stock: 0 });
	await repo.create({ desc: 'Pan', order_point: 10, stock: 0 });
	await repo.create({ desc: 'Amargo Obrero', order_point: 10, stock: 0 });
}

async function seed() {
	await db.delete(t_product);
	await db.delete(t_category);
	await db.delete(t_user_has_role);
	await db.delete(t_user);
	await db.delete(t_role);

	const { admin_id } = await seed_roles();
	await seed_users(admin_id);
	await seed_categories();
	await seed_products();
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
