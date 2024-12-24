import type { Infer } from 'sveltekit-superforms';
import { roles } from '$lib/user';
import { z } from '$lib/utils/es-zod';

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
