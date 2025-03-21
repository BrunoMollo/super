import { category_repo } from '$lib';
import { json } from '@sveltejs/kit';

export const GET = async ({ params }) => {
	const cat_id = Number(params.cat_id);
	const category = await category_repo.get_one_with_count(cat_id);

	if (!category) {
		return json(null);
	}

	return json(category);
};
