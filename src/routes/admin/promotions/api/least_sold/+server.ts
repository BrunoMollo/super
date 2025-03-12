import { sale_line_repo } from '$lib';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const data = await sale_line_repo.get_least_sold_products();
	return await json(data);
};
