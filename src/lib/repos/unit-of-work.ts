import { TransactionDatabaseError } from '$lib/errors';
import type { Repos, Unit_of_Work } from '$lib/logic/ports/i-unit-of-work';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { Mock_User_Repo } from '../../test/mocks/mock-user-repo';
import { Category_Repo_Drizzle } from './category-repo-drizzle';

export class Unit_of_Work_Drizzle implements Unit_of_Work {
	constructor(private ctx: DB_Context) {}

	private create_repos(tx: DB_Context & { rollback: () => never }) {
		return {
			category_repo: new Category_Repo_Drizzle(tx),
			user_repo: new Mock_User_Repo([]), //TODO change
			rollback: () => tx.rollback()
		} satisfies Repos;
	}

	async do<R>(callback: (repos: Repos) => R): Promise<R | TransactionDatabaseError> {
		try {
			return await this.ctx.transaction(async (tx) => {
				const repos = this.create_repos(tx);
				return await callback(repos);
			});
		} catch (err) {
			console.log(err);
			const msj = JSON.stringify(err);
			return new TransactionDatabaseError(msj);
		}
	}
}
