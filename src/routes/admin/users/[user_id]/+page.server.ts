import { user_controller, user_repo } from '$lib';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/client';
import { edit_user_validator } from '$lib/entities/user';
import { exaust } from '$lib/logic/helpers/results';
import type { LayoutRouteId } from '../../../$types';
import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = Number(params.user_id);

	const { user } = locals;

	if (!user.has_role('ADMIN')) {
		const url = '/login' satisfies LayoutRouteId;
		return redirect(307, url);
	}

	const selected_user = await user_repo.get_one(id);
	if (!selected_user) {
		return error(404, 'User not found');
	}

	const roles_id = selected_user.roles.map((x) => x.id);
	const populated_form = { user_id: selected_user.id, roles_id };

	const { username, roles } = selected_user;
	return {
		user: { id, username, roles },
		form: await superValidate(populated_form, zod(edit_user_validator))
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(edit_user_validator));
		if (!form.valid) {
			return { form };
		}

		const { user } = locals;

		const res = await user_controller.edit(form.data, user);

		switch (res.status) {
			case 'ok': {
				return { form };
			}
			case 'not-found': {
				return error(404, 'User Not Found');
			}
			case 'unauthorized': {
				const url = '/login' satisfies LayoutRouteId;
				return redirect(401, url);
			}
			default:
				exaust(res);
		}
	}
};
