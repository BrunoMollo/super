import { eq } from 'drizzle-orm';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_category, t_product, t_product_has_category } from '$lib/server/drizzle/schema';

export class Product_Repo_Drizzle {
	async update(data: { id: number; desc: string; order_point: number; categories_ids: number[] }) {
		return await this.ctx.transaction(async (tx) => {
			await tx
				.update(t_product)
				.set({ desc: data.desc, order_point: data.order_point })
				.where(eq(t_product.id, data.id));

			await tx.delete(t_product_has_category).where(eq(t_product_has_category.product_id, data.id));

			for (const category_id of data.categories_ids) {
				await tx.insert(t_product_has_category).values({ product_id: data.id, category_id });
			}
		});
	}
	constructor(private ctx: DB_Context) {}

	async get_one(id: number) {
		const product = await this.ctx
			.select()
			.from(t_product)
			.where(eq(t_product.id, id))
			.then((x) => x.at(0));

		const categories = await this.ctx
			.select()
			.from(t_product_has_category)
			.innerJoin(t_category, eq(t_product_has_category.category_id, t_category.id))
			.where(eq(t_product_has_category.product_id, id))
			.then((x) => x.map(({ category }) => category));

		return { ...product, categories };
	}

	async list_all() {
		const data = await this.ctx.select().from(t_product);

		const products = data.map(({ id, desc, order_point, stock }) => ({
			id,
			desc,
			order_point,
			stock,
			categories: [] as { id: number; name: string }[]
		}));

		for (const product of products) {
			const categories = await this.ctx
				.select()
				.from(t_product_has_category)
				.innerJoin(t_category, eq(t_product_has_category.category_id, t_category.id))
				.where(eq(t_product_has_category.product_id, product.id))
				.then((x) => x.map(({ category }) => category));
			product.categories = categories;
		}

		return products;
	}

	async create(product: {
		desc: string;
		order_point: number;
		stock: number;
		categories_ids: Array<number>;
	}) {
		const { desc, order_point, stock } = product;

		return this.ctx.transaction(async (tx) => {
			const { product_id } = await tx
				.insert(t_product)
				.values({ desc, order_point, stock })
				.returning({ product_id: t_product.id })
				.then((x) => x[0]);
			for (const category_id of product.categories_ids) {
				await tx.insert(t_product_has_category).values({ product_id, category_id });
			}
			return product_id;
		});
	}

	async remove(id: number) {
		return this.ctx.transaction(async (tx) => {
			await tx.delete(t_product_has_category).where(eq(t_product_has_category.product_id, id));
			await tx.delete(t_product).where(eq(t_product.id, id));
		});
	}
}
