import { category_controller } from '$lib';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { create_category_validator } from '$lib/entities/category';
import { handel_error } from '$lib/errors';
import { serilize } from '$lib/utils/parsing';
import type { Actions, PageServerLoad } from '../users/$types';

export const load: PageServerLoad = async () => {
	const categories = await category_controller.list_all().then(serilize).catch(handel_error);
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
		await category_controller.create(form.data).catch(handel_error);

		return { form };
	}
};
