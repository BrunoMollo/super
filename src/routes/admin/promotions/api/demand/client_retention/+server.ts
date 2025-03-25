import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch }) => {
	const response = await fetch('http://localhost:8000/client_retention');
	return json(response);
};
