import { product_repo } from '$lib';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	const { barcode } = params;
	const product = await product_repo.get_by_barcode(Number(barcode));

	if (!product) {
		return json(null);
	}

	return json(product);
};
