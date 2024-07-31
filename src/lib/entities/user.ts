export type Role = 'ADMIN' | 'SELLER';

export class User {
	constructor(
		public id: number,
		public username: string,
		public password_hash: string,
		public roles: Role[]
	) {}
}
