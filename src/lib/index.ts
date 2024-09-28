import { Category_Controller } from './logic/category-controller';
import { Role_Controller } from './logic/role-controller';
import { User_Controller } from './logic/users-controller';
import { Category_Repo_Drizzle } from './repos/category-repo-drizzle';
import { Role_Repo_Drizzle } from './repos/role-repo-drizzle';
import { Unit_of_Work_Drizzle } from './repos/unit-of-work';
import { User_Repo_Drizzle } from './repos/user-repo-drizzle';
import { db } from './server/drizzle/drizzle-client';
import { Hash_Service_Bcrypt } from './services/hash_service';
import { JWT_Service } from './services/jwt_service';

// Serivces
const hash_service = new Hash_Service_Bcrypt();
export const token_service = new JWT_Service();

//Repos
const role_repo = new Role_Repo_Drizzle(db);
const user_repo = new User_Repo_Drizzle(db, hash_service);
const category_repo = new Category_Repo_Drizzle(db);

// Unit of Work
const uow = new Unit_of_Work_Drizzle(db, hash_service);

//Controllers
export const role_controller = new Role_Controller(role_repo);
export const user_controller = new User_Controller(user_repo, token_service, uow);
export const category_controller = new Category_Controller(category_repo);
