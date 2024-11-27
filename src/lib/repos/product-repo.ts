import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_product } from '$lib/server/drizzle/schema';

export class Product_Repo_Drizzle {
	constructor(private ctx: DB_Context) {}

	async list_all() {
		const data = await this.ctx.select().from(t_product);
		return data.map(({ id, desc, order_point, stock }) => ({
			id,
			desc,
			order_point,
			stock
		}));
	}

	async create(product: { desc: string; order_point: number; stock: number }) {
		const { desc, order_point, stock } = product;
		const { id } = await this.ctx
			.insert(t_product)
			.values({ desc, order_point, stock })
			.returning({ id: t_product.id })
			.then((x) => x[0]);
		return id;
	}
}