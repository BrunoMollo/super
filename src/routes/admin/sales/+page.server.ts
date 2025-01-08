import { sale_repo } from '$lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const sales = sale_repo.get_sales();
	return { sales };
};
