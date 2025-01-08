import { eq } from 'drizzle-orm';
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

	async get_by_dni(dni: string) {
		return await this.ctx
			.select()
			.from(t_client)
			.where(eq(t_client.dni, dni))
			.then((x) => x.at(0));
	}

	async exists_with_dni(dni: string) {
		return await this.ctx
			.select({ id: t_client.id })
			.from(t_client)
			.where(eq(t_client.dni, dni))
			.then((x) => !!x.at(0));
	}
}
