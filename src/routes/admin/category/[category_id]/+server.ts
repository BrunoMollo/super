import { category_repo } from '$lib';
import { type RequestHandler, json } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ locals, params }) => {
	const { user } = locals;
	if (!user.has_role('ADMIN')) {
		return new Response('Forbidden', { status: 403 });
	}

	const id = Number(params.category_id);

	const ok = await category_repo.remove(id);

	return json({
		ok,
		message: ok ? 'Categoria Borrada' : 'NO se puede borrar la cateogria: Hay productos asociados'
	});
};
