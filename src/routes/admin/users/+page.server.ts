import { User } from '$lib/entities/user';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = [
		new User(1, 'bruno_mollo', 'hash-abc', ['ADMIN']),
		new User(1, 'rami_digia', 'hash-123', ['ADMIN', 'SELLER']),
		new User(1, 'faus_saludas', 'hash-xyz', ['SELLER'])
	].serilize();

	console.log(users);
	return { users };
};
