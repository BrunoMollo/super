import { eq } from 'drizzle-orm';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_product, t_sale, t_sale_line } from '$lib/server/drizzle/schema';

export class Sale_Line_Repo {
	constructor(private ctx: DB_Context) {}

	async get_all_product_sales(barcode: string) {
		return await this.ctx
			.select({
				date: t_sale.created_at,
				quantity: t_sale_line.quantity,
				price: t_sale_line.unit_price
			})
			.from(t_sale_line)
			.innerJoin(t_product, eq(t_product.id, t_sale_line.product_id))
			.innerJoin(t_sale, eq(t_sale.id, t_sale_line.sale_id))
			.where(eq(t_product.bar_code, barcode));
	}
}
