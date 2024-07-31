import { z } from 'zod';

export type Role = 'ADMIN' | 'SELLER';

export class User {
	constructor(
		public id: number,
		public username: string,
		public password_hash: string,
		public roles: Role[]
	) {}
}

export const create_user_dto = z
	.object({
		username: z.string().min(4).max(36),
		password: z.string().min(4).max(36)
	})
	.brand('create_user_dto');

export type Create_user_dto = Prettify<typeof create_user_dto._type>;

type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};
