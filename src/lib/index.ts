// place files you want to import through the `$lib` alias in this folder.
import { Mock_User_Repo } from '../test/mocks/mock-user-repo';
import { create_user_validator } from './entities/user';
import { JWT_Service } from './services/jwt_service';
import { User_Controller } from './use-cases/users-logic';

const user_repo = new Mock_User_Repo([]); //replace with real db

export const token_service = new JWT_Service();

export const user_controller = new User_Controller(user_repo, token_service);

// Seed
const bruno = create_user_validator.parse({
	username: 'bruno',
	password: '1234',
	roles_id: [1]
});
user_controller.create(bruno);
