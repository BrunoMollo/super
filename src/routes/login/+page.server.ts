import { token_service, user_repo } from '$lib';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { dev } from '$app/environment';
import { login_validator } from '$lib/entities/user.js';
import type { LayoutRouteId } from '../$types.js';
import type { Actions, PageServerLoad } from './$types.js';
import { error, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(login_validator))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(login_validator));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, password } = form.data;

		const res = await user_repo.validate({ username, password });
		if (!res.pass) {
			return error(401, 'Wrong username or password');
		}

		const token = await token_service.create_token(res.user);

		event.cookies.set('token', token, {
			httpOnly: true,
			path: '/',
			secure: !dev,
			maxAge: token_service.get_max_age_seconds()
		});

		const url = '/admin/users' satisfies LayoutRouteId;
		return redirect(302, url);
	}
};
