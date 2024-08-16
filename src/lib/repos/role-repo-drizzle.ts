import type { Role } from '$lib/entities/user';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_role } from '$lib/server/drizzle/schema';

export class Role_Repo_Drizzle {
	constructor(private ctx: DB_Context) {}

	async create(category: { name: string }): Promise<Role> {
		const { name } = category;
		const { id } = await this.ctx
			.insert(t_role)
			.values({ name })
			.returning({ id: t_role.id })
			.then((x) => x[0]);

		return { id, name } as Role;
	}
}
