import { product_repo, sale_repo } from '$lib';
import type { User } from '$lib/user';

export async function get_products(
	input: { product_id: number; quantity: number }[],
) {	
	const products_ids = input.map((x) => x.product_id);
	const all_exits = await product_repo.check_every_one_exists_by_id(products_ids);
	if (!all_exits) {
		return { ok: false, type: 'product not found' } as const;
	}
	const result = await product_repo.list_all_by_id(products_ids);

	const products = [] as {
		product_id: number;
		quantity: number;
		unit_price: number;
		iva_percentage: number;
	}[];

	for (const { product_id, quantity } of input) {
		const { price , iva_percentage} = result.find((x) => x.id === product_id)!;
		products.push({
			product_id,
			quantity,
			unit_price: price,
			iva_percentage:Number(iva_percentage) 
		});
	}
	return {ok:true, products} as const

}

export async function register_sale(
	products: { product_id: number; quantity: number; unit_price: number; iva_percentage: number }[],
	user: User,
	billData: {
		cae: string;
		expiration_date_of_cae: Date;
		billNumber: number;
	},
	client_id?: number,
) {
	const { cae, expiration_date_of_cae, billNumber } = billData;
	const seller_id = user.getId();
	await sale_repo.register_sale({ seller_id, products, client_id, bill: { cae, expiration_date_of_cae, voucher_number: billNumber } });
	return { ok: true };
}
