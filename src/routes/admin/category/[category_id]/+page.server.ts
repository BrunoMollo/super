import { category_controller } from '$lib';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/client';
import { edit_category_validator } from '$lib/entities/category';
import { handel_error } from '$lib/errors';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.category_id);
	const category = await category_controller.get_one(id).catch(handel_error);

	const { name } = category;
	return { form: await superValidate({ id, name }, zod(edit_category_validator)) };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(edit_category_validator));
		if (!form.valid) {
			return { form };
		}

		await category_controller.edit(form.data).catch(handel_error);

		return { form };
	}
};
