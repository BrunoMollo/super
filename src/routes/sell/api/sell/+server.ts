import { register_sale } from '$lib/services/sales-service';
import type { Sell } from './sell.client';
import { type RequestHandler, json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = locals;
	if (!user.has_role('SELLER')) {
		return new Response('Forbidden', { status: 403 });
	}

	const { products } = (await request.json()) as Sell;

	const res = await register_sale(products, user);
	console.log(res);

	return json(res);
};
