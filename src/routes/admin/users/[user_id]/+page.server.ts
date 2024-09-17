import { user_controller } from '$lib';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/client';
import { edit_user_validator } from '$lib/entities/user';
import { handel_error } from '$lib/errors';
import { serilize_one } from '$lib/utils/parsing';
import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.user_id);
	const user = await user_controller.get_one(id).catch(handel_error);
	if (!user) {
		return error(404, 'User not Found');
	}

	const roles_id = user.roles.map((x) => x.id);
	const populated_form = { user_id: user.id, roles_id };
	return {
		user: serilize_one(user),
		form: await superValidate(populated_form, zod(edit_user_validator))
	};
};

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(edit_user_validator));
		if (!form.valid) {
			return { form };
		}

		await user_controller.edit(form.data).catch(handel_error);

		return { form };
	}
};
