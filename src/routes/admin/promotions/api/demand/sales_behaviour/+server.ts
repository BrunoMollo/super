import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch }) => {
	const response = await fetch('http://localhost:8000/sales_behaviour');
	return json(response);
};
