import { user_controller } from '$lib';
import { serilize } from '$lib/utils/parsing';
import { superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { create_user_validator } from '$lib/entities/user';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const users = await user_controller.list_all().then(serilize);

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
		await user_controller.create(form.data);

		return { form };
	}
};
