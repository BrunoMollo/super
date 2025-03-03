import { product_repo } from '$lib';
import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const search_query = url.searchParams.get('name') as string;
	return json(await product_repo.get_by_description(search_query));
};
