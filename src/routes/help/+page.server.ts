import type { PageServerLoad } from '../login/$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const { user } = locals;

	if (!user) {
		throw redirect(307, '/login');
	}

	if (user.has_role('ADMIN')) {
		throw redirect(307, '/docs/manual-administrador.pdf');
	}

	if (user.has_role('SELLER')) {
		throw redirect(307, '/docs/manual-vendedor.pdf');
	}

	throw redirect(307, '/login');
};
