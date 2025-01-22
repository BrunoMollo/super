import { product_repo } from '$lib';
import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { barcode } = params;
	const product = await product_repo.get_by_barcode(barcode);

	if (!product) {
		return json(null);
	}

	return json(product);
};
