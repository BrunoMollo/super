import { uow, user_repo } from '$lib';
import { zod } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms/client';
import type { LayoutRouteId } from '../../../$types';
import { edit_user_validator } from '../user-validator';
import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';

const VALIDATOR = edit_user_validator;

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = Number(params.user_id);

	const { user } = locals;

	if (!user.has_role('ADMIN')) {
		const url = '/login' satisfies LayoutRouteId;
		return redirect(307, url);
	}

	const selected_user = await user_repo.get_one(id);
	if (!selected_user) {
		return error(404, 'User not found');
	}

	const roles_id = selected_user.roles.map((x) => x.id);
	const populated_form = { user_id: selected_user.id, roles_id };

	const { username, roles } = selected_user;
	return {
		user: { id, username, roles },
		form: await superValidate(populated_form, zod(VALIDATOR))
	};
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await superValidate(request, zod(VALIDATOR));
		if (!form.valid) {
			return { form };
		}

		const { user } = locals;

		const { user_id, roles_id } = form.data;

		if (!user.has_role('ADMIN')) {
			const url = '/login' satisfies LayoutRouteId;
			return redirect(307, url);
		}

		const selected_user = await user_repo.get_one(user_id);
		if (!selected_user) {
			return error(404, 'User Not Found');
		}

		await uow.do(async (repos) => {
			await repos.user_repo.remove_all_roles({ user_id });
			for (const role_id of roles_id) {
				await repos.user_repo.add_role({ user_id, role_id });
			}
		});

		return { form };
	}
};
