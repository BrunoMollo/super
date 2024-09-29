import type { Category_Repo } from './i-category-repo';
import type { User_Repo } from './i-user-repo';

export type Repos = {
	user_repo: User_Repo;
	category_repo: Category_Repo;
};

export interface Unit_of_Work {
	/**
	 * @throws {DrizzleError}
	 */
	do<R>(callback: (tx: Repos) => R): Promise<R>;
}
