import { category_controller } from '$lib';
import { create_category_validator } from '$lib/entities/category';
import { serilize } from '$lib/utils/parsing';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from '../users/$types';
import { fail, superValidate } from 'sveltekit-superforms';

export const load: PageServerLoad = async () => {
	const categories = await category_controller.list_all().then(serilize);
	return {
		categories,
		form: await superValidate(zod(create_category_validator))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(create_category_validator));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		await category_controller.create(form.data);

		return { form };
	}
};
