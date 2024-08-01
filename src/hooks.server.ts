import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const respose = await resolve(event);
	return respose;
};

/**
 * Custom redirect to redirect in the backend (avoid extra requests)
 */
// function hook_redirect(location: string) {
// 	return new Response(undefined, {
// 		status: 303,
// 		headers: { location }
// 	});
// }
