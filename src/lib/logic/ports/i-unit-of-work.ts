import type { TransactionDatabaseError } from '$lib/errors';
import type { Category_Repo } from './i-category-repo';
import type { User_Repo } from './i-user-repo';

export type Repos = {
	user_repo: User_Repo;
	category_repo: Category_Repo;
	rollback: () => never;
};

export interface Unit_of_Work {
	do<R>(callback: (tx: Repos) => R): Promise<R | TransactionDatabaseError>;
}
