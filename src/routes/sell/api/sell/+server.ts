import { client_repo } from '$lib';
import { register_sale } from '$lib/services/sales-service';
import type { Sell } from './sell.client';
import { type RequestHandler, json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ locals, request }) => {
	const { user } = locals;
	if (!user.has_role('SELLER')) {
		return new Response('Forbidden', { status: 403 });
	}

	const { products, client } = (await request.json()) as Sell;

	let client_id = undefined as number | undefined;

	if (client._exits === false) {
		client_id = await client_repo.create(client);
	}

	if (client._exits === true) {
		const db_client = await client_repo.get_by_dni(client.dni);
		if (!db_client) {
			return new Response('Cliente no encontrado', { status: 404 });
		}
		client_id = db_client.id;
	}

	const res = await register_sale(products, user, client_id);

	return json(res);
};
