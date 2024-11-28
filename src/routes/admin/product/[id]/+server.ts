import { product_repo } from '$lib';
import { type RequestHandler, json } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { user } = locals;
	if (!user.has_role('ADMIN')) {
		return new Response('Forbidden', { status: 403 });
	}
	const id = Number(params.id);

	await product_repo.remove(id);

	return json({ ok: true });
};
