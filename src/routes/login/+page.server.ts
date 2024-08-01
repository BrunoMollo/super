import { login_validator } from '$lib/entities/user.js';
import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { LayoutRouteId } from '../$types.js';
import { user_controller } from '$lib';
import { LoginError } from '$lib/errors.js';

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
		const res = await user_controller.login(form.data);

		if (res instanceof LoginError) {
			return error(res.status, res);
		}

		const url = '/admin/users' satisfies LayoutRouteId;
		return redirect(302, url);
	}
};
