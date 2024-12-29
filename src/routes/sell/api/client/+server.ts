import { client_repo } from '$lib';
import { type RequestHandler, json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url }) => {
	const { user } = locals;
	if (!user.has_role('SELLER')) {
		return new Response('Forbidden', { status: 403 });
	}

	const dni = url.searchParams.get('dni');
	if (!dni) {
		return new Response('Missing dni', { status: 400 });
	}

	const exists = await client_repo.exists_with_dni(dni);

	if (!exists) {
		return json({ exists: false });
	}

	return json({ exists: true });
};
