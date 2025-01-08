import { desc, eq } from 'drizzle-orm/expressions';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_product, t_sale, t_sale_line } from '$lib/server/drizzle/schema';

export class Sale_Repo {
	constructor(private ctx: DB_Context) {}

	async get_sales() {
		return this.ctx
			.select()
			.from(t_sale)
			.innerJoin(t_sale_line, eq(t_sale_line.sale_id, t_sale.id))
			.innerJoin(t_product, eq(t_product.id, t_sale_line.product_id))
			.orderBy(desc(t_sale.id));
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
