import { category_controller, category_repo } from '$lib';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { create_category_validator } from '$lib/entities/category';
import { exaust } from '$lib/logic/helpers/results';
import type { LayoutRouteId } from '../../$types';
import type { Actions, PageServerLoad } from '../users/$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;

	if (!user.has_role('ADMIN')) {
		const url = '/login' satisfies LayoutRouteId;
		return redirect(307, url);
	}

	const categories = await category_repo.get_all();

	return {
		categories,
		form: await superValidate(zod(create_category_validator))
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(create_category_validator));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { user } = locals;

		const res = await category_controller.create(form.data, user);

		switch (res.status) {
			case 'ok': {
				return { form };
			}
			case 'duplicated-name': {
				return setError(form, 'name', 'This name already exists');
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
