import { user_controller } from '$lib';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/client';
import { edit_user_validator } from '$lib/entities/user';
import { serilize_one } from '$lib/utils/parsing';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.user_id);
	const user = await user_controller.get_one(id);
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
