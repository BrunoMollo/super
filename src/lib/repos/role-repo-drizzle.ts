import { eq } from 'drizzle-orm';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_role } from '$lib/server/drizzle/schema';
import type { Role } from '$lib/user';

export class Role_Repo_Drizzle {
	constructor(private ctx: DB_Context) {}

	async get_all(): Promise<Role[]> {
		const data = await this.ctx.select().from(t_role);
		return data.map(({ id, name }) => ({ id, name })) as Role[];
	}

	async get_one(id: number): Promise<Role | undefined> {
		const data = await this.ctx
			.select()
			.from(t_role)
			.where(eq(t_role.id, id))
			.then((x) => x.at(0));
		if (!data) {
			return undefined;
		}
		const { name } = data;
		return { id, name } as Role;
	}

	async create(category: { id: number; name: string }): Promise<number> {
		const { id, name } = category;
		await this.ctx.insert(t_role).values({ id, name });

		return id;
	}
}
