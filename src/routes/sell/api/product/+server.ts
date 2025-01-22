import { product_repo } from '$lib';
import { type RequestHandler, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url }) => {
	const { user } = locals;
	if (!user.has_role('SELLER')) {
		return new Response('Forbidden', { status: 403 });
	}

	const code_bar = Number(url.searchParams.get('code_bar'));
	if (!code_bar) {
		return new Response('Missing code_bar', { status: 400 });
	}

	const product = await product_repo.get_by_barcode(code_bar);

	if (!product) {
		return new Response('Product not found', { status: 404 });
	}

	return json({
		product: {
			id: product.id,
			desc: product.desc,
			price: product.price
		}
	});
};
