import { user_controller } from '$lib';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/client';
import { edit_user_validator } from '$lib/entities/user';
import { exaust } from '$lib/logic/helpers/results';
import { serilize_one } from '$lib/utils/parsing';
import type { LayoutRouteId } from '../../../$types';
import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = Number(params.user_id);

	const { user } = locals;
	const res = await user_controller.get_one(id, user);

	switch (res.status) {
		case 'ok': {
			const user = res.output;
			const roles_id = user.roles.map((x) => x.id);
			const populated_form = { user_id: user.id, roles_id };
			return {
				user: serilize_one(user),
				form: await superValidate(populated_form, zod(edit_user_validator))
			};
		}
		case 'unauthorized': {
			const url = '/login' satisfies LayoutRouteId;
			return redirect(401, url);
		}
		case 'not-found': {
			return error(404, 'User not found');
		}
		default:
			exaust(res);
	}
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
