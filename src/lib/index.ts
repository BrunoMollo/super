// place files you want to import through the `$lib` alias in this folder.
import { dev } from '$app/environment';
import { Mock_User_Repo } from '../test/mocks/mock-user-repo';
import { create_category_validator } from './entities/category';
import { create_user_validator } from './entities/user';
import { Category_Controller } from './logic/category-controller';
import { User_Controller } from './logic/users-controller';
import { Category_Repo_Drizzle } from './repos/category-repo-drizzle';
import { Unit_of_Work_Drizzle } from './repos/unit-of-work';
import { db } from './server/drizzle/drizzle-client';
import { JWT_Service } from './services/jwt_service';

const mock_users_data = [];
export const uow = new Unit_of_Work_Drizzle(db);

const user_repo = new Mock_User_Repo(mock_users_data); //replace with real db
const category_repo = new Category_Repo_Drizzle(db);

export const token_service = new JWT_Service();

export const user_controller = new User_Controller(user_repo, token_service, uow);

export const category_controller = new Category_Controller(category_repo, uow);

// Seed
if (dev) {
	const bruno = create_user_validator.parse({
		username: 'bruno',
		password: '1234',
		roles_id: [1]
	});
	user_controller.create(bruno);

	const category = create_category_validator.parse({
		name: 'Lacteos'
	});
	category_controller.create(category);
}
