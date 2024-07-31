import { create_user_dto } from '$lib/entities/user.js';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types.js';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { LayoutRouteId } from '../../$types.js';
import { user_controller } from '$lib';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(create_user_dto))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(create_user_dto));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		await user_controller.create(form.data);

		const url = '/admin/users' satisfies LayoutRouteId;
		return redirect(302, url);
	}
};
