import { category_repo } from '$lib';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/client';
import type { LayoutRouteId } from '../../../$types';
import { edit_category_validator } from '../category-validators';
import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

const VALIDATOR = edit_category_validator;

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = Number(params.category_id);

	const { user } = locals;

	if (!user.has_role('ADMIN')) {
		const url = '/login' satisfies LayoutRouteId;
		return redirect(401, url);
	}

	const category = await category_repo.get_one(id);
	if (!category) {
		return error(404, 'No se encontro la categoria');
	}

	const { name } = category;
	return { form: await superValidate({ id, name }, zod(VALIDATOR)) };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(VALIDATOR));
		if (!form.valid) {
			return { form };
		}

		const { user } = locals;

		const { id, name } = form.data;

		if (!user.has_any_role(['ADMIN'])) {
			const url = '/login' satisfies LayoutRouteId;
			return redirect(307, url);
		}

		const category = await category_repo.get_one(id);
		if (!category) {
			return error(404, 'No se encontro la categoria');
		}

		const match = await category_repo.get_by_name(name);
		if (match) {
			return setError(form, 'name', 'Ya hay una categoria con este nombre');
		}

		await category_repo.update({ id, name });

		return { form };
	}
};
