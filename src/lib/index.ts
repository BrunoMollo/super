// place files you want to import through the `$lib` alias in this folder.
import { Mock_User_Repo } from '../test/mocks/mock-user-repo';
import { User_Controller } from './use-cases/users-logic';

const user_repo = new Mock_User_Repo([]);
user_repo.create({ username: 'Bruno', password: '1244' });
export const user_controller = new User_Controller(user_repo);
