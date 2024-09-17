import { user_controller } from '$lib';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { create_user_validator } from '$lib/entities/user';
import { handel_error } from '$lib/errors';
import { serilize } from '$lib/utils/parsing';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const users = await user_controller.list_all().then(serilize).catch(handel_error);

	return {
		users,
		form: await superValidate(zod(create_user_validator))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(create_user_validator));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		await user_controller.create(form.data).catch(handel_error);

		return { form };
	}
};
