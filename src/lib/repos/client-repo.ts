import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_client } from '$lib/server/drizzle/schema';

export class Client_Repo {
	constructor(private ctx: DB_Context) {}

	async create(client: { dni: string; email: string; first_name: string; last_name: string }) {
		return await this.ctx
			.insert(t_client)
			.values(client)
			.returning({ id: t_client.id })
			.then((x) => x[0])
			.then((x) => x.id);
	}
}
