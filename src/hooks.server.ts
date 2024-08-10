import type { Handle } from '@sveltejs/kit';
import type { LayoutRouteId } from './routes/$types';
import { token_service } from '$lib';
import { Emplty_User, User } from '$lib/entities/user';

/**
 * This function handels every incomming request (similar to a middelware)
 */
export const handle: Handle = async ({ event, resolve }) => {
	const pathname = event.url.pathname as NonNullable<LayoutRouteId>;
	const token = event.cookies.get('token');
	const user = await get_user_from_token(token);
	event.locals.user = user;

	/**
	 * ADMIN GUARD
	 */
	if (pathname.match('^/admin')) {
		const is_admin = user.has_role('ADMIN');
		if (is_admin) {
			return await resolve(event);
		}
	}

	/**
	 * SELLER GUARD
	 */
	if (pathname.match('^/seller')) {
		const is_seller = user.has_role('SELLER');
		if (is_seller) {
			return await resolve(event);
		}
	}

	/**
	 * PUBLIC URLS
	 */
	if (pathname == '/login') {
		return await resolve(event);
	}

	/**
	 * ELSE REDIRECT TO LOGIN
	 */
	return hook_redirect('/login');
};

/**
 * Create user from auth token
 */
async function get_user_from_token(token: string | undefined) {
	if (!token) {
		return new Emplty_User();
	}

	const res = await token_service.validate(token);
	if (!res.valid) {
		return new Emplty_User();
	}
	const { id, username, roles } = res.user;
	return new User(id, username, '', roles);
}

/**
 * Custom redirect to redirect in the backend (avoid extra requests)
 */
function hook_redirect(location: NonNullable<LayoutRouteId>) {
	return new Response(undefined, {
		status: 303,
		headers: { location }
	});
}
