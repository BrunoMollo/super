import { user_controller } from '$lib';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = await user_controller.list_all().then((x) => x.serilize());

	return { users };
};
