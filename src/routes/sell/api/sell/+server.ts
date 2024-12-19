import type { Sell } from './sell.client';
import { type RequestHandler, json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = locals;
	if (!user.has_role('SELLER')) {
		return new Response('Forbidden', { status: 403 });
	}

	const body = (await request.json()) as Sell;

	// TODO: Change for actual logic
	console.log(body);

	return json({
		ok: true
	});
};
