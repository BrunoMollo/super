import { user_controller } from '$lib';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { create_user_validator } from '$lib/entities/user';
import { exaust } from '$lib/logic/helpers/results';
import { serilize } from '$lib/utils/parsing';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const res = await user_controller.list_all();

	switch (res.status) {
		case 'ok': {
			return {
				users: serilize(res.output),
				form: await superValidate(zod(create_user_validator))
			};
		}
		default:
			exaust(res.status);
	}
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(create_user_validator));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const res = await user_controller.create(form.data);

		switch (res.status) {
			case 'ok': {
				return { form };
			}
			case 'duplicated-username': {
				return setError(form, 'username', 'This username already exists');
			}
			default:
				exaust(res);
		}
	}
};
