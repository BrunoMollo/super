import type { Infer } from 'sveltekit-superforms';
import { z } from '$lib/utils/es-zod';

export const login_validator = z
	.object({
		username: z.string().min(4).max(36),
		password: z.string().min(4).max(36)
	})
	.brand('login_dto');

export type Login_dto = Infer<typeof login_validator>;
