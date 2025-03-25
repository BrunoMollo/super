import { and, eq, gte, max, sql, sum } from 'drizzle-orm';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import {
	t_category,
	t_product,
	t_product_has_category,
	t_product_price,
	t_sale,
	t_sale_line
} from '$lib/server/drizzle/schema';

export class Sale_Line_Repo {
	constructor(private ctx: DB_Context) {}

	async get_all_product_sales(barcode: string) {
		const threeYearsAgo = new Date();
		threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

		return await this.ctx
			.select({
				date: t_sale.created_at,
				quantity: t_sale_line.quantity,
				price: t_sale_line.unit_price
			})
			.from(t_sale_line)
			.innerJoin(t_product, eq(t_product.id, t_sale_line.product_id))
			.innerJoin(t_sale, eq(t_sale.id, t_sale_line.sale_id))
			.where(and(eq(t_product.bar_code, Number(barcode)), gte(t_sale.created_at, threeYearsAgo)));
	}

	async get_all_sales_by_category_id(cat_id: number) {
		const threeYearsAgo = new Date();
		threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

		return await this.ctx
			.select({ date: sql`DATE(sale.created_at)`, quantity_sum: sum(t_sale_line.quantity) })
			.from(t_sale_line) //cantidad
			.innerJoin(
				t_product_has_category,
				eq(t_product_has_category.product_id, t_sale_line.product_id)
			) //categoria
			.innerJoin(t_sale, eq(t_sale.id, t_sale_line.sale_id)) //fecha
			.where(
				and(eq(t_product_has_category.category_id, cat_id), gte(t_sale.created_at, threeYearsAgo))
			)
			.groupBy(sql`DATE(sale.created_at)`);
	}

	async get_sale_count_by_category() {
		const threeYearsAgo = new Date();
		threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 3);

		return await this.ctx
			.select({
				category_id: t_product_has_category.category_id,
				category_name: t_category.name,
				count: sum(t_sale_line.quantity).mapWith(Number)
			})
			.from(t_sale_line)
			.innerJoin(
				t_product_has_category,
				eq(t_product_has_category.product_id, t_sale_line.product_id)
			)
			.innerJoin(t_category, eq(t_category.id, t_product_has_category.category_id))
			.innerJoin(t_sale, eq(t_sale.id, t_sale_line.sale_id))
			.where(gte(t_sale.created_at, threeYearsAgo))
			.groupBy(t_product_has_category.category_id, t_category.name);
	}

	async get_least_sold_products() {
		const oneYearAgo = new Date();
		oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 3);

		const prices = this.ctx
			.select({
				product_id: t_product_price.product_id,
				last_date: max(t_product_price.date_from).as('last_date')
			})
			.from(t_product_price)
			.groupBy(t_product_price.product_id)
			.as('prices');

		return await this.ctx
			.select({
				id: t_product.id,
				name: t_product.desc,
				quantity: sum(t_sale_line.quantity),
				last_sale: max(t_sale.created_at),
				price: t_product_price.price_amount
			})
			.from(t_product)
			.innerJoin(t_sale_line, eq(t_sale_line.product_id, t_product.id))
			.innerJoin(t_sale, eq(t_sale.id, t_sale_line.sale_id))
			.innerJoin(prices, eq(prices.product_id, t_product.id))
			.innerJoin(
				t_product_price,
				and(
					eq(t_product_price.product_id, t_product.id),
					eq(t_product_price.date_from, prices.last_date)
				)
			)
			.where(gte(t_sale.created_at, oneYearAgo))
			.groupBy(t_product.id, t_product.desc, t_product_price.price_amount)
			.orderBy(max(t_sale.created_at))
			.limit(20);
	}
}
