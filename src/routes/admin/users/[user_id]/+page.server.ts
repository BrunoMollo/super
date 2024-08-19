import { user_controller } from '$lib';
import { superValidate } from 'sveltekit-superforms/client';
import { serilize } from '$lib/utils/parsing';
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.user_id);
	const user = await user_controller.get_one(id);
	if (!user) {
		return error(404, 'User not Found');
	}
	return { user: serilize(user) };
	// const form = superValidate();
	// return { form };
};
