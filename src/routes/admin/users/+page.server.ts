import { uow, user_repo } from '$lib';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { LayoutRouteId } from '../../$types';
import type { Actions, PageServerLoad } from './$types';
import { create_user_validator } from './user-validator';
import { fail, redirect } from '@sveltejs/kit';

const VALIDATOR = create_user_validator;

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;

	if (!user.has_role('ADMIN')) {
		const url = '/login' satisfies LayoutRouteId;
		return redirect(307, url);
	}

	const list = await user_repo.get_all();

	return {
		users: list.map((x) => ({ ...x })),
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

		if (!user.has_role('ADMIN')) {
			const url = '/login' satisfies LayoutRouteId;
			return redirect(401, url);
		}

		const { username, password, roles_id } = form.data;

		const match_username = await user_repo.get_by_username(username);
		if (match_username) {
			return setError(form, 'username', 'El usuario ya existe');
		}

		await uow.do(async (repos) => {
			const user_id = await repos.user_repo.create({ username, password });

			for (const role_id of roles_id) {
				await repos.user_repo.add_role({ user_id, role_id });
			}
		});

		return { form };
	}
};
