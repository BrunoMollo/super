import { eq } from 'drizzle-orm';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_product } from '$lib/server/drizzle/schema';

export class Product_Repo_Drizzle {
	update(data: { id: number; desc: string; order_point: number }) {
		return this.ctx
			.update(t_product)
			.set({ desc: data.desc, order_point: data.order_point })
			.where(eq(t_product.id, data.id));
	}
	constructor(private ctx: DB_Context) {}

	async get_one(id: number) {
		return this.ctx
			.select()
			.from(t_product)
			.where(eq(t_product.id, id))
			.then((x) => x.at(0));
	}

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
