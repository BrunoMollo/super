import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_sale, t_sale_line } from '$lib/server/drizzle/schema';

export class Sale_Repo {
	constructor(private ctx: DB_Context) {}

	async register_sale({
		seller_id,
		products,
		client_id,
		bill
	}: {
		seller_id: number;
		products: { product_id: number; quantity: number; unit_price: number }[];
		client_id?: number;
		bill:{
			cae: string;
			expiration_date_of_cae: Date;
			voucher_number: number;
		}
	}) {
		const { cae, expiration_date_of_cae, voucher_number } = bill;
		this.ctx.transaction(async (tx) => {
			const { sale_id } = await tx
				.insert(t_sale)
				.values({ seller_id, client_id, cae, expiration_date_of_cae, voucher_number
					
				 })
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
