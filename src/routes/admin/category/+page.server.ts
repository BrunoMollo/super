import { category_repo } from '$lib';
import { fail, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { LayoutRouteId } from '../../$types';
import type { Actions, PageServerLoad } from '../users/$types';
import { create_category_validator } from './category-validators';
import { redirect } from '@sveltejs/kit';

const VALIDATOR = create_category_validator;

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;

	if (!user.has_role('ADMIN')) {
		const url = '/login' satisfies LayoutRouteId;
		return redirect(307, url);
	}

	const categories = category_repo.get_all_with_count();

	return {
		categories,
		form: await superValidate(zod(VALIDATOR))
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(VALIDATOR));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const { user } = locals;
		const { name } = form.data;

		if (!user.has_role('ADMIN')) {
			const url = '/login' satisfies LayoutRouteId;
			return redirect(307, url);
		}

		const match = await category_repo.get_by_name(name);
		if (match) {
			return setError(form, 'name', 'This name already exists');
		}

		await category_repo.create({ name });

		return { form };
	}
};
