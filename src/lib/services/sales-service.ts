import { product_repo, sale_repo } from '$lib';
import type { User } from '$lib/user';

export async function register_sale(input: { product_id: number; quantity: number }[], user: User) {
	if (!user.has_role('SELLER')) {
		return { ok: false, type: 'unautorized' as const };
	}
	const products_ids = input.map((x) => x.product_id);
	const all_exits = await product_repo.check_every_one_exists_by_id(products_ids);
	if (!all_exits) {
		return { ok: false, type: 'product not found' as const };
	}
	const products = await product_repo.list_all_by_id(products_ids);

	const sale = [] as {
		product_id: number;
		quantity: number;
		unit_price: number;
	}[];

	for (const { product_id, quantity } of input) {
		const { price } = products.find((x) => x.id === product_id)!;
		sale.push({
			product_id,
			quantity,
			unit_price: price
		});
	}

	const seller_id = user.getId();
	await sale_repo.register_sale({ seller_id, products: sale });
	return { ok: true };
}
