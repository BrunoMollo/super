// place files you want to import through the `$lib` alias in this folder.
import { dev } from '$app/environment';
import { create_category_validator } from './entities/category';
import { create_user_validator } from './entities/user';
import { Category_Controller } from './logic/category-controller';
import { Role_Controller } from './logic/role-controller';
import { User_Controller } from './logic/users-controller';
import { Category_Repo_Drizzle } from './repos/category-repo-drizzle';
import { Role_Repo_Drizzle } from './repos/role-repo-drizzle';
import { User_Repo_Drizzle } from './repos/user-repo-drizzle';
import { db } from './server/drizzle/drizzle-client';
import { Hash_Service_IMPL } from './services/hash_service';
import { JWT_Service } from './services/jwt_service';

const hash_service = new Hash_Service_IMPL();

const user_repo = new User_Repo_Drizzle(db, hash_service);
const category_repo = new Category_Repo_Drizzle(db);

export const token_service = new JWT_Service();

export const user_controller = new User_Controller(user_repo, token_service);

export const category_controller = new Category_Controller(category_repo);

const role_repo = new Role_Repo_Drizzle(db);
const role_controller = new Role_Controller(role_repo);

// Seed
if (dev) {
	await role_controller.create_or_skip({ id: 1, name: 'ADMIN' });
	await role_controller.create_or_skip({ id: 2, name: 'SELLER' });

	const bruno = create_user_validator.parse({
		username: 'bruno',
		password: '1234',
		roles_id: [1]
	});
	await user_controller.create(bruno);

	const category = create_category_validator.parse({
		name: 'Lacteos'
	});
	await category_controller.create(category);
}
