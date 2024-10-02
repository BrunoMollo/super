import { category_controller } from '$lib';
import { zod } from 'sveltekit-superforms/adapters';
import { setError, superValidate } from 'sveltekit-superforms/client';
import { edit_category_validator } from '$lib/entities/category';
import { exaust } from '$lib/logic/helpers/results';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.category_id);

	const res = await category_controller.get_one(id);

	switch (res.status) {
		case 'ok': {
			const { name } = res.output;
			return { form: await superValidate({ id, name }, zod(edit_category_validator)) };
		}
		case 'not-found': {
			return error(404, 'not found');
		}
		default:
			exaust(res);
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(edit_category_validator));
		if (!form.valid) {
			return { form };
		}

		const res = await category_controller.edit(form.data);

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
			default:
				exaust(res);
		}
	}
};
