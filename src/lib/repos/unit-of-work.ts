import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import type { Hash_Service_Bcrypt } from '$lib/services/hash_service';
import { Category_Repo_Drizzle } from './category-repo-drizzle';
import { User_Repo_Drizzle } from './user-repo-drizzle';

export class Unit_of_Work_Drizzle {
	constructor(
		private ctx: DB_Context,
		private hash_service: Hash_Service_Bcrypt
	) {}

	private create_repos(tx: DB_Context & { rollback: () => never }) {
		return {
			category_repo: new Category_Repo_Drizzle(tx),
			user_repo: new User_Repo_Drizzle(tx, this.hash_service)
		};
	}

	async do<R>(callback: (repos: ReturnType<typeof this.create_repos>) => R): Promise<R> {
		return await this.ctx.transaction(async (tx) => {
			const repos = this.create_repos(tx);
			return await callback(repos);
		});
	}
}
