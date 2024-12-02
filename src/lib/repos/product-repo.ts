import { desc, eq } from 'drizzle-orm';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_category, t_product, t_product_has_category } from '$lib/server/drizzle/schema';

export class Product_Repo_Drizzle {
	constructor(private ctx: DB_Context) {}

	async update(data: {
		id: number;
		desc: string;
		bar_code: number;
		order_point: number;
		categories_ids: number[];
	}) {
		return await this.ctx.transaction(async (tx) => {
			await tx
				.update(t_product)
				.set({ desc: data.desc, bar_code: data.bar_code, order_point: data.order_point })
				.where(eq(t_product.id, data.id));

			await tx.delete(t_product_has_category).where(eq(t_product_has_category.product_id, data.id));

			for (const category_id of data.categories_ids) {
				await tx.insert(t_product_has_category).values({ product_id: data.id, category_id });
			}
		});
	}

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
		const data = await this.ctx.select().from(t_product).orderBy(desc(t_product.id));

		const products = data.map(({ id, desc, bar_code, order_point, stock }) => ({
			id,
			desc,
			order_point,
			bar_code,
			stock,
			categories: [] as { id: number; name: string }[]
		}));

		const categories = await this.ctx
			.select()
			.from(t_product_has_category)
			.innerJoin(t_category, eq(t_product_has_category.category_id, t_category.id))
			.then((arr) => {
				const map = new Map<number, Array<{ id: number; name: string }>>();
				for (const item of arr) {
					const { product_id } = item.product_has_category;
					if (!map.has(product_id)) {
						map.set(product_id, []);
					}
					map.get(product_id)?.push(item.category);
				}
				return map;
			});

		for (const product of products) {
			product.categories = categories.get(product.id) || [];
		}

		return products;
	}

	async create(product: {
		desc: string;
		bar_code: number;
		order_point: number;
		categories_ids: Array<number>;
	}) {
		const { desc, bar_code, order_point } = product;

		return this.ctx.transaction(async (tx) => {
			const { product_id } = await tx
				.insert(t_product)
				.values({ desc, bar_code, order_point, stock: 0 })
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
