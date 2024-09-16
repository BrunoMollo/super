import { category_controller } from '$lib';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/client';
import { edit_category_validator } from '$lib/entities/category';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.category_id);
	const category = await category_controller.get_one(id);
	if (!category) {
		return error(404, 'User not Found');
	}

	const { name } = category;
	return { form: await superValidate({ name }, zod(edit_category_validator)) };
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(edit_category_validator));
		if (!form.valid) {
			return { form };
		}
		console.log(form.data);
		return { form };
	}
};
