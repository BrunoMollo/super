import { dev } from '$app/environment';
import type { LayoutRouteId } from '../$types';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async (event) => {
	// FAKE POSITIVE OF DRIZZLE LINTER
	// eslint-disable-next-line drizzle/enforce-delete-with-where
	event.cookies.delete('token', {
		httpOnly: true,
		path: '/',
		secure: !dev
	});
	const url = '/login' satisfies LayoutRouteId;
	return redirect(302, url);
};
