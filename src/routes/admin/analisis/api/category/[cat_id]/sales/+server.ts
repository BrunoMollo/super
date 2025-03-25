import { sale_line_repo } from '$lib';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { cat_id } = params;
	const asd = await sale_line_repo.get_all_sales_by_category_id(Number(cat_id));
	return json(asd);
};
