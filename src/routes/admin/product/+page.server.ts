import { product_repo } from '$lib';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { create_category_validator } from '$lib/entities/category';
import type { Actions, PageServerLoad } from '../users/$types';

export const load: PageServerLoad = async ({ locals }) => {
	const products = product_repo.list_all();
	return { products };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(create_category_validator));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { user } = locals;
		if (user.has_role('ADMIN')) {
			return fail(401, { form });
		}

		const { name } = form.data;
		await product_repo.create({ name, stock: 0, order_point: 0 });
		return { form };
	}
};
