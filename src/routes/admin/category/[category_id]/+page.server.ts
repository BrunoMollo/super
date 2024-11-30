import { category_controller, category_repo } from '$lib';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/client';
import { edit_category_validator } from '$lib/entities/category';
import { exaust } from '$lib/logic/helpers/results';
import type { LayoutRouteId } from '../../../$types';
import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = Number(params.category_id);

	const { user } = locals;

	//const res = await category_controller.get_one(id, user);

	if (!user.has_role('ADMIN')) {
		const url = '/login' satisfies LayoutRouteId;
		return redirect(401, url);
	}

	const category = await category_repo.get_one(id);
	if (!category) {
		return error(404, 'not found');
	}

	const { name } = category;
	return { form: await superValidate({ id, name }, zod(edit_category_validator)) };
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(edit_category_validator));
		if (!form.valid) {
			return { form };
		}

		const { user } = locals;

		const res = await category_controller.edit(form.data, user);

		switch (res.status) {
			case 'ok': {
				return { form };
			}
			case 'not-found': {
				return error(404, 'Category Not Found');
			}
			case 'duplicated-name': {
				return setError(form, 'name', 'There is already a category with this name');
			}
			case 'unauthorized': {
				const url = '/login' satisfies LayoutRouteId;
				return redirect(401, url);
			}
			default:
				exaust(res);
		}
	}
};
