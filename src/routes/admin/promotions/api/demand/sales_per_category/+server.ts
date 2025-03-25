import { sale_line_repo } from '$lib';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const res = await sale_line_repo.get_sale_count_by_category();
	return json(res);
};
