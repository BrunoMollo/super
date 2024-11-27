import type { Infer } from 'sveltekit-superforms';
import { z } from 'zod';

export const create_product_validator = z.object({
	desc: z.string().min(4).max(36)
});

export type Product_Create_Dto = Infer<typeof create_product_validator>;
