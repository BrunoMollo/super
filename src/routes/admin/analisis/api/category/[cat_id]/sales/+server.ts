import { sale_line_repo } from '$lib';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	// @ts-expect-error IDK why the server.ts file is not recognizing the slug, even though it is under the corresponding folder
	const { barcode } = params;
	const asd = await sale_line_repo.get_all_sales_by_category_id(barcode);
	return json(asd);
};
