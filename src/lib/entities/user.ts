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
	name: Role_Name;
}[];

export const roles_ids = [1, 2] as const;
export const roles_names = ['ADMIN', 'SELLER'] as const;

export type Role = (typeof roles)[number];
export type Role_Name = (typeof roles_names)[number];

export interface User {
	has_role(role_name: Role_Name): boolean;
	has_any_role(roles_names: Role_Name[]): boolean;
}

export class Authorized_User implements User {
	constructor(
		public id: number,
		public username: string,
		public roles: Role[]
	) {}

	has_role(role_name: Role_Name) {
		return !!this.roles.find((x) => x.name === role_name);
	}

	has_any_role(roles_names: Role_Name[]) {
		for (const name of roles_names) {
			if (this.has_role(name)) {
				return true;
			}
		}
		return false;
	}
}

export class Empty_User implements User {
	has_role() {
		return false;
	}

	has_any_role() {
		return false;
	}
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
		roles_id: z.array(
			z
				.number()
				.min(1)
				.max(roles.length + 1)
		)
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

/**
 *
 */
export const edit_user_validator = z
	.object({
		user_id: z.number().int().positive(),
		roles_id: z.array(
			z
				.number()
				.min(1)
				.max(roles.length + 1)
		)
	})
	.brand('edit_user_dto');

export type Edit_User_Dto = Infer<typeof edit_user_validator>;
