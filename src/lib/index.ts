
import { Category_Repo_Drizzle } from './repos/category-repo-drizzle';
import { Product_Repo_Drizzle } from './repos/product-repo';
import { Unit_of_Work_Drizzle } from './repos/unit-of-work';
import { User_Repo_Drizzle } from './repos/user-repo-drizzle';
import { db } from './server/drizzle/drizzle-client';
import { Hash_Service_Bcrypt } from './services/hash_service';
import { JWT_Service } from './services/jwt_service';

// Serivces
const hash_service = new Hash_Service_Bcrypt();
export const token_service = new JWT_Service();

//Repos
export const user_repo = new User_Repo_Drizzle(db, hash_service);
export const category_repo = new Category_Repo_Drizzle(db);

export const product_repo = new Product_Repo_Drizzle(db);

// Unit of Work
export const uow = new Unit_of_Work_Drizzle(db, hash_service);

