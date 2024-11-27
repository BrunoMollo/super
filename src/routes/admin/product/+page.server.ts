import { product_repo } from '$lib';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { create_category_validator } from '$lib/entities/category';
import type { Actions, PageServerLoad } from '../users/$types';
import { create_product_validator } from './validators';
import { redirect } from '@sveltejs/kit';

const VALIDATOR = create_product_validator;

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;
	if (!user.has_role('ADMIN')) {
		return redirect(302, '/login');
	}
	const products = product_repo.list_all();
	return { products, form: await superValidate(zod(VALIDATOR)) };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(VALIDATOR));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { user } = locals;
		if (!user.has_role('ADMIN')) {
			return fail(401, { form });
		}

		const { desc } = form.data;
		await product_repo.create({ desc, stock: 0, order_point: 0 });
		return { form };
	}
};