import { category_controller, user_controller } from '$lib';
import { create_category_validator } from '$lib/entities/category';
import { create_user_validator } from '$lib/entities/user';
import { Role_Repo_Drizzle } from '$lib/repos/role-repo-drizzle';
import { db } from '$lib/server/drizzle/drizzle-client';

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
	const bruno = create_user_validator.parse({
		username: 'bruno',
		password: '1234',
		roles_id: [admin_id]
	});
	await user_controller.create(bruno);
}

async function seed_categories() {
	title_seeder('Categories');
	const category = create_category_validator.parse({
		name: 'Lacteos'
	});
	await category_controller.create(category);
}

async function seed() {
	const { admin_id } = await seed_roles();
	await seed_users(admin_id);
	await seed_categories();
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
