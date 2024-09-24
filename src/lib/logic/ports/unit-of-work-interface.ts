import type { Category_Repo, User_Repo } from './repos-interfaces';

export type Repos = {
	user_repo: User_Repo;
	category_repo: Category_Repo;
	rollback: () => never;
};

export interface Unit_of_Work {
	/**
	 * @throws {TransactionDatabaseError}
	 */
	do<R>(callback: (tx: Repos) => R): Promise<R>;
}
