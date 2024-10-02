import type { Hash_Service } from '$lib/logic/ports/services-interfaces';
import type { Repos, Unit_of_Work } from '$lib/logic/ports/unit-of-work-interfaces';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { Category_Repo_Drizzle } from './category-repo-drizzle';
import { User_Repo_Drizzle } from './user-repo-drizzle';

export class Unit_of_Work_Drizzle implements Unit_of_Work {
	constructor(
		private ctx: DB_Context,
		private hash_service: Hash_Service
	) {}

	private create_repos(tx: DB_Context & { rollback: () => never }) {
		return {
			category_repo: new Category_Repo_Drizzle(tx),
			user_repo: new User_Repo_Drizzle(tx, this.hash_service)
		} satisfies Repos;
	}

	async do<R>(callback: (repos: Repos) => R): Promise<R> {
		return await this.ctx.transaction(async (tx) => {
			const repos = this.create_repos(tx);
			return await callback(repos);
		});
	}
}
