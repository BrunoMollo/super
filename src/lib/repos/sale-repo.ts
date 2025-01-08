import { desc, eq } from 'drizzle-orm/expressions';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_product, t_sale, t_sale_line } from '$lib/server/drizzle/schema';

export type Sale = Awaited<ReturnType<Sale_Repo['get_sales']>>[0];

export class Sale_Repo {
	constructor(private ctx: DB_Context) {}

	async get_sales() {
		const result = await this.ctx
			.select({
				sale_id: t_sale.id,
				line: {
					quantity: t_sale_line.quantity,
					product_id: t_product.id,
					desc: t_product.desc,
					unit_price: t_sale_line.unit_price
				}
			})
			.from(t_sale)
			.innerJoin(t_sale_line, eq(t_sale_line.sale_id, t_sale.id))
			.innerJoin(t_product, eq(t_product.id, t_sale_line.product_id))
			.orderBy(desc(t_sale.id));

		type _Sale = {
			id: number;
			lines: Array<(typeof result)[0]['line']>;
		};

		const map = new Map<number, _Sale>();
		for (const { sale_id, line } of result) {
			if (!map.has(sale_id)) {
				map.set(sale_id, { id: sale_id, lines: [line] });
			} else {
				map.get(sale_id)?.lines.push(line);
			}
		}
		return Array.from(map.values());
	}

	async register_sale({
		seller_id,
		products,
		client_id
	}: {
		seller_id: number;
		products: { product_id: number; quantity: number; unit_price: number }[];
		client_id?: number;
	}) {
		this.ctx.transaction(async (tx) => {
			const { sale_id } = await tx
				.insert(t_sale)
				.values({ seller_id, client_id })
				.returning({ sale_id: t_sale.id })
				.then((x) => x[0]);

			for (const { product_id, quantity, unit_price } of products) {
				await tx
					.insert(t_sale_line)
					.values({ sale_id, product_id, quantity, unit_price: unit_price.toFixed(2) });
			}
		});
	}
}
