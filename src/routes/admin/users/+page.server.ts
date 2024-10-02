import { user_controller } from '$lib';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { create_user_validator } from '$lib/entities/user';
import { exaust } from '$lib/logic/helpers/results';
import { serilize } from '$lib/utils/parsing';
import type { LayoutRouteId } from '../../$types';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;
	const res = await user_controller.list_all(user);

	switch (res.status) {
		case 'ok': {
			return {
				users: serilize(res.output),
				form: await superValidate(zod(create_user_validator))
			};
		}
		case 'unauthorized': {
			const url = '/login' satisfies LayoutRouteId;
			return redirect(401, url);
		}
		default:
			exaust(res);
	}
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(create_user_validator));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { user } = locals;

		const res = await user_controller.create(form.data, user);

		switch (res.status) {
			case 'ok': {
				return { form };
			}
			case 'duplicated-username': {
				return setError(form, 'username', 'This username already exists');
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
