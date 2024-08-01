import { user_controller } from '$lib';
import { serilize } from '$lib/utils/parsing';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = await user_controller.list_all().then(serilize);

	return { users };
};
