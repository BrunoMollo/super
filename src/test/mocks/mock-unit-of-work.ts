import { DrizzleError } from 'drizzle-orm';
import { TransactionDatabaseError } from '$lib/errors';
import type { Category_Repo, User_Repo } from '$lib/logic/ports/repos-interfaces';
import type { Repos, Unit_of_Work } from '$lib/logic/ports/unit-of-work-interface';

export class Mock_Unit_of_Work implements Unit_of_Work {
	public category_repo!: Category_Repo;
	public user_repo!: User_Repo;

	private create_repos() {
		return {
			category_repo: this.category_repo,
			user_repo: this.user_repo,
			rollback: () => {
				throw new DrizzleError({});
			}
		} satisfies Repos;
	}

	async do<R>(callback: (repos: Repos) => R): Promise<R> {
		try {
			const repos = this.create_repos();
			return await callback(repos);
		} catch (err) {
			console.log(err);
			const msj = JSON.stringify(err);
			throw new TransactionDatabaseError(msj);
		}
	}
}
