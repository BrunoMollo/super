import type { Infer } from 'sveltekit-superforms';
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

//
// Validators
//

/**
 *
 */
export const create_user_validator = z
	.object({
		username: z.string().min(4).max(36),
		password: z.string().min(4).max(36)
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
