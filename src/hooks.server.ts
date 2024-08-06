import type { Handle } from '@sveltejs/kit';
import type { LayoutRouteId } from './routes/$types';
import { token_service } from '$lib';

export const handle: Handle = async ({ event, resolve }) => {
	const { pathname } = event.url;

	if (pathname === '/') {
		return hook_redirect('/login');
	}

	if (pathname == '/login') {
		const respose = await resolve(event);
		return respose;
	}

	const token = event.cookies.get('token');

	if (!token) {
		console.log('Unauthenticated');
		return hook_redirect('/login');
	}

	const res = await token_service.validate(token);

	if (!res.valid) {
		console.log('Unauthenticated');
		return hook_redirect('/login');
	}

	const respose = await resolve(event);
	return respose;
};

/**
 * Custom redirect to redirect in the backend (avoid extra requests)
 */
function hook_redirect(location: NonNullable<LayoutRouteId>) {
	return new Response(undefined, {
		status: 303,
		headers: { location }
	});
}
