export function translateRole(role: string) {
	switch (role) {
		case 'ADMIN':
			return 'Administrador';
		case 'SELLER':
			return 'Vendedor';
		default:
			throw new Error(`Invalid role: ${role}`);
	}
}
