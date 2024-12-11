import { token_service, user_repo } from '$lib';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { dev } from '$app/environment';
import type { LayoutRouteId } from '../$types.js';
import type { Actions, PageServerLoad } from './$types.js';
import { login_validator } from './login-validator.js';
import { error, redirect } from '@sveltejs/kit';

const VALIDATOR = login_validator;

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(VALIDATOR))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(VALIDATOR));
		if (!form.valid) {
			return fail(400, { form });
		}

		const { username, password } = form.data;

		const res = await user_repo.validate({ username, password });
		if (!res.pass) {
			return error(401, 'Usuario o contraseña incorrectos');
		}

		const token = await token_service.create_token(res.user);

		event.cookies.set('token', token, {
			httpOnly: true,
			path: '/',
			secure: !dev,
			maxAge: token_service.get_max_age_seconds()
		});

		const url = '/admin/product' satisfies LayoutRouteId;
		return redirect(302, url);
	}
};
