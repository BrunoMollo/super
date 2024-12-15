import { category_repo, product_repo } from '$lib';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import { create_product_validator } from './validators';
import { type Actions, redirect } from '@sveltejs/kit';

const VALIDATOR = create_product_validator;

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;
	if (!user.has_role('ADMIN')) {
		return redirect(302, '/login');
	}

	const products = product_repo.list_all();
	const categories = category_repo.get_all();
	return { products, categories, form: await superValidate(zod(VALIDATOR)) };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(VALIDATOR));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { user } = locals;
		if (!user.has_role('ADMIN')) {
			return fail(401, { form });
		}

		const same_desc = await product_repo.exists_with_description(form.data.desc);
		if (same_desc) {
			return setError(form, 'desc', 'Esta Descripción ya existe');
		}

<<<<<<< HEAD
		const same_bar_code = await product_repo.get_by_code_bar(form.data.bar_code).then((x) => !!x);
=======
		const same_bar_code = await product_repo.exists_with_bar_code(form.data.bar_code);
>>>>>>> main
		if (same_bar_code) {
			return setError(form, 'bar_code', 'Este código de barras ya existe');
		}

		await product_repo.create(form.data);
		return { form };
	}
};
