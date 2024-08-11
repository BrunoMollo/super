import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { LayoutRouteId } from '../$types';
import { dev } from '$app/environment';

export const load: PageServerLoad = async (event) => {
	event.cookies.delete('token', {
		httpOnly: true,
		path: '/',
		secure: !dev
	});
	const url = '/login' satisfies LayoutRouteId;
	return redirect(302, url);
};
