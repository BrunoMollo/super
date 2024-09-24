import { token_service, user_controller } from '$lib';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { dev } from '$app/environment';
import { login_validator } from '$lib/entities/user.js';
import { handel_error } from '$lib/errors.js';
import type { LayoutRouteId } from '../$types.js';
import type { Actions, PageServerLoad } from './$types.js';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(login_validator))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(login_validator));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		const res = await user_controller.login(form.data).catch(handel_error);

		event.cookies.set('token', res.token, {
			httpOnly: true,
			path: '/',
			secure: !dev,
			maxAge: token_service.get_max_age_seconds()
		});

		const url = '/admin/users' satisfies LayoutRouteId;
		return redirect(302, url);
	}
};
