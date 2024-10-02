import type { Category_Repo, User_Repo } from './repos-interfaces';

export class RollbackError extends Error {}

export type Repos = {
	user_repo: User_Repo;
	category_repo: Category_Repo;
};

export interface Unit_of_Work {
	/**
	 * @throws {RollbackError}
	 */
	do<R>(callback: (tx: Repos) => R): Promise<R>;
}
