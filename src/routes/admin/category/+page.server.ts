import { category_controller } from '$lib';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { create_category_validator } from '$lib/entities/category';
import { exaust } from '$lib/logic/helpers/results';
import { serilize } from '$lib/utils/parsing';
import type { Actions, PageServerLoad } from '../users/$types';

export const load: PageServerLoad = async () => {
	const res = await category_controller.list_all();

	switch (res.status) {
		case 'ok': {
			return {
				categories: serilize(res.output),
				form: await superValidate(zod(create_category_validator))
			};
		}
		default:
			exaust(res.status);
	}
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(create_category_validator));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const res = await category_controller.create(form.data);

		switch (res.status) {
			case 'ok': {
				return { form };
			}
			case 'duplicated-name': {
				return setError(form, 'name', 'This name already exists');
			}
			default:
				exaust(res);
		}
	}
};
