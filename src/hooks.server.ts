import type { Handle } from '@sveltejs/kit';
import type { LayoutRouteId } from './routes/$types';

export const handle: Handle = async ({ event, resolve }) => {
	if (event.url.pathname === '/') {
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
