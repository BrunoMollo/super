import { uow, user_repo } from '$lib';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { create_user_validator } from '$lib/entities/user';
import type { LayoutRouteId } from '../../$types';
import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;

	if (!user.has_role('ADMIN')) {
		const url = '/login' satisfies LayoutRouteId;
		return redirect(307, url);
	}

	const list = await user_repo.get_all();

	return {
		users: list.map((x) => ({ ...x })),
		form: await superValidate(zod(create_user_validator))
	};
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

		if (!user.has_role('ADMIN')) {
			const url = '/login' satisfies LayoutRouteId;
			return redirect(401, url);
		}

		const { username, password, roles_id } = form.data;

		const match_username = await user_repo.get_by_username(username);
		if (match_username) {
			return setError(form, 'username', 'This username already exists');
		}

		await uow.do(async (repos) => {
			const new_user = await repos.user_repo.create({ username, password });
			const user_id = new_user.id;

			for (const role_id of roles_id) {
				await repos.user_repo.add_role({ user_id, role_id });
			}
		});

		return { form };
	}
};
