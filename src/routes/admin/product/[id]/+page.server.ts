import { category_repo, product_repo } from '$lib';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { update_product_validator } from '../validators';
import type { PageServerLoad } from './$types';
import { type Actions, error, redirect } from '@sveltejs/kit';

const VALIDATOR = update_product_validator;

export const load: PageServerLoad = async ({ locals, params }) => {
	const { user } = locals;
	if (!user.has_role('ADMIN')) {
		return redirect(302, '/login');
	}

	const id = Number(params.id);
	const product = await product_repo.get_one(id);
	if (!product) {
		return error(404, 'Product Not Found');
	}

	const categories = await category_repo.get_all();
	const categories_ids = product.categories.map(({ id }) => id);

	return {
		product,
		categories,
		form: await superValidate({ ...product, categories_ids }, zod(VALIDATOR))
	};
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

		const existing = await product_repo.get_one(form.data.id);
		if (!existing) {
			return fail(404, { form });
		}

		const same_desc = await product_repo.get_by_description(form.data.desc).then((x) => !!x);
		if (same_desc && existing.desc !== form.data.desc) {
			return setError(form, 'desc', 'Esta Descripción ya existe');
		}

		const same_bar_code = await product_repo.get_by_bar_code(form.data.bar_code).then((x) => !!x);
		if (same_bar_code && existing.bar_code !== form.data.bar_code) {
			return setError(form, 'bar_code', 'Este código de barras ya existe');
		}

		await product_repo.update(form.data);
		return redirect(302, '/admin/product');
	}
};
