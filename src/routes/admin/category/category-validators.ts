import type { Infer } from 'sveltekit-superforms';
import { z } from '$lib/utils/es-zod';

// ./+page.server.ts
export const create_category_validator = z
	.object({
		name: z.string().min(4).max(36)
	})
	.brand('create_category_validator_dto');

export type Create_Category_Dto = Infer<typeof create_category_validator>;

// ./[category_id]/+page.server.ts
export const edit_category_validator = z.object({
	id: z.number().int().positive(),
	name: z.string().min(4).max(36)
});

export type Edit_Cateogory_Dto = Infer<typeof edit_category_validator>;
