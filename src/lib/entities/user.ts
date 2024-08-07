import type { Infer } from 'sveltekit-superforms';
import { z } from 'zod';

export const roles = [
	{
		id: 1,
		name: 'ADMIN'
	},
	{
		id: 2,
		name: 'SELLER'
	}
] satisfies {
	id: (typeof roles_ids)[number];
	name: (typeof roles_names)[number];
}[];

export const roles_ids = [1, 2] as const;
export const roles_names = ['ADMIN', 'SELLER'] as const;

export type Role = (typeof roles)[number];

export class User {
	constructor(
		public id: number,
		public username: string,
		public password_hash: string,
		public roles: Role[]
	) {}
}

//
// Validators
//

/**
 *
 */
export const create_user_validator = z
	.object({
		username: z.string().min(4).max(36),
		password: z.string().min(4).max(36),
		roles_id: z.array(z.number()) //TODO: check that roles id exists
	})
	.brand('create_user_dto');

export type Create_user_dto = Infer<typeof create_user_validator>;

/**
 *
 */
export const login_validator = z
	.object({
		username: z.string().min(4).max(36),
		password: z.string().min(4).max(36)
	})
	.brand('login_dto');

export type Login_dto = Infer<typeof login_validator>;
