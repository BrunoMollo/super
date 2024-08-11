// place files you want to import through the `$lib` alias in this folder.
import { Mock_Category_Repo } from '../test/mocks/mock-category-repo';
import { Mock_User_Repo } from '../test/mocks/mock-user-repo';
import { create_category_validator } from './entities/category';
import { create_user_validator } from './entities/user';
import { JWT_Service } from './services/jwt_service';
import { Category_Controller } from './use-cases/category-logic';
import { User_Controller } from './use-cases/users-logic';

const user_repo = new Mock_User_Repo([]); //replace with real db
const category_repo = new Mock_Category_Repo([]);

export const token_service = new JWT_Service();

export const user_controller = new User_Controller(user_repo, token_service);

export const category_controller = new Category_Controller(category_repo);

// Seed
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
