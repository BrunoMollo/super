import { category_repo } from '$lib';
import type { RequestHandler } from '../$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	const { barcode } = params;
	const category = await category_repo.get_one_with_count(barcode);

	if (!category) {
		return json(null);
	}

	return json(category);
};
