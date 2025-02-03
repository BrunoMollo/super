import { and, desc, eq, inArray, lte, max } from 'drizzle-orm';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import {
	t_category,
	t_product,
	t_product_has_category,
	t_product_price
} from '$lib/server/drizzle/schema';

export class Product_Repo_Drizzle {
	constructor(private ctx: DB_Context) {}

	async get_by_code_bar(code_bar: number) {
		const product = await this.ctx
			.select()
			.from(t_product)
			.where(eq(t_product.bar_code, code_bar))
			.then((x) => x.at(0));

		if (!product) {
			return null;
		}

		const price = await this.ctx
			.select()
			.from(t_product_price)
			.where(
				and(eq(t_product_price.product_id, product.id), lte(t_product_price.date_from, new Date()))
			)
			.orderBy(desc(t_product_price.date_from))
			.limit(1)
			.then((x) => x[0])
			.then((x) => Number(x.price_amount));

		return {
			...product,
			price
		};
	}

	async update(data: {
		id: number;
		desc: string;
		bar_code: number;
		order_point: number;
		price: number;
		iva_percentage: number;
		categories_ids: number[];
	}) {
		return await this.ctx.transaction(async (tx) => {
			await tx
				.update(t_product)
				.set({
					desc: data.desc,
					bar_code: data.bar_code,
					order_point: data.order_point,
					iva_percentage: data.iva_percentage.toFixed(2)
				})
				.where(eq(t_product.id, data.id));

			const price_amount = data.price.toString();
			await tx.insert(t_product_price).values({ product_id: data.id, price_amount });

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

		if (!product) return null;

		const price = await this.ctx
			.select()
			.from(t_product_price)
			.where(eq(t_product_price.product_id, id))
			.orderBy(desc(t_product_price.date_from))
			.limit(1)
			.then((x) => x[0])
			.then((x) => Number(x.price_amount));

		const categories = await this.ctx
			.select()
			.from(t_product_has_category)
			.innerJoin(t_category, eq(t_product_has_category.category_id, t_category.id))
			.where(eq(t_product_has_category.product_id, id))
			.then((x) => x.map(({ category }) => category));

		return { ...product, iva_percentage: Number(product?.iva_percentage), categories, price };
	}

	private async get_last_date_prices() {
		return this.ctx.$with('sq_last_date').as(
			this.ctx
				.select({
					product_id: t_product_price.product_id,
					last_date: max(t_product_price.date_from).as('last_date')
				})
				.from(t_product_price)
				.groupBy(t_product_price.product_id)
		);
	}
	async list_all() {
		const data = await this.ctx.select().from(t_product).orderBy(desc(t_product.id));

		const products = data.map(({ id, desc, bar_code, order_point, stock }) => ({
			id,
			desc,
			order_point,
			bar_code,
			stock,
			price: 0,
			categories: [] as { id: number; name: string }[]
		}));

		const sq_last_date_prices = await this.get_last_date_prices();

		const prices = await this.ctx
			.with(sq_last_date_prices)
			.select({ product_id: t_product_price.product_id, price: t_product_price.price_amount })
			.from(t_product_price)
			.innerJoin(
				sq_last_date_prices,
				and(
					eq(t_product_price.product_id, sq_last_date_prices.product_id),
					eq(t_product_price.date_from, sq_last_date_prices.last_date)
				)
			);

		for (const { product_id, price } of prices) {
			const product = products.find((x) => x.id === product_id);
			if (product) {
				product.price = Number(price);
			}
		}

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

	async check_every_one_exists_by_id(ids: number[]) {
		const result = await this.ctx
			.select({ id: t_product.id })
			.from(t_product)
			.where(inArray(t_product.id, ids));
		return result.length === ids.length;
	}

	async list_all_by_id(ids: number[]) {
		const products = await this.ctx
			.select()
			.from(t_product)
			.where(inArray(t_product.id, ids))
			.then((arr) => arr.map((x) => ({ ...x, price: 0 })));

		const sq_last_date_prices = await this.get_last_date_prices();

		const prices = await this.ctx
			.with(sq_last_date_prices)
			.select({ product_id: t_product_price.product_id, price: t_product_price.price_amount })
			.from(t_product_price)
			.innerJoin(
				sq_last_date_prices,
				and(
					eq(t_product_price.product_id, sq_last_date_prices.product_id),
					eq(t_product_price.date_from, sq_last_date_prices.last_date)
				)
			);

		for (const { product_id, price } of prices) {
			const product = products.find((x) => x.id === product_id);
			if (product) {
				product.price = Number(price);
			}
		}

		return products;
	}

	async create(product: {
		desc: string;
		bar_code: number;
		order_point: number;
		price: number;
		iva_percentage: number;
		categories_ids: Array<number>;
	}) {
		const { desc, bar_code, order_point, price, iva_percentage } = product;

		return this.ctx.transaction(async (tx) => {
			const { product_id } = await tx
				.insert(t_product)
				.values({
					desc,
					bar_code,
					order_point,
					stock: 0,
					iva_percentage: iva_percentage.toString()
				})
				.returning({ product_id: t_product.id })
				.then((x) => x[0]);

			const price_amount = price.toString();
			await tx.insert(t_product_price).values({ product_id, price_amount });

			for (const category_id of product.categories_ids) {
				await tx.insert(t_product_has_category).values({ product_id, category_id });
			}
			return product_id;
		});
	}

	//TODO: make it soft
	async remove(id: number) {
		return this.ctx.transaction(async (tx) => {
			await tx.delete(t_product_has_category).where(eq(t_product_has_category.product_id, id));
			await tx.delete(t_product).where(eq(t_product.id, id));
		});
	}

	async exists_with_description(description: string) {
		return await this.ctx
			.select()
			.from(t_product)
			.where(eq(t_product.desc, description))
			.then((x) => Boolean(x.at(0)));
	}

	async exists_with_bar_code(bar_code: number) {
		return await this.ctx
			.select()
			.from(t_product)
			.where(eq(t_product.bar_code, bar_code))
			.then((x) => Boolean(x.at(0)));
	}
}
