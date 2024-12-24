import type { Infer } from 'sveltekit-superforms';
import { z } from '$lib/utils/es-zod';

export const create_product_validator = z.object({
	desc: z.string().min(4).max(36),
	bar_code: z.coerce.number().int().min(100_000_000_000).max(999_999_999_999),
	order_point: z.coerce.number().min(0).max(10_000_000),
	price: z.coerce.number().min(0).max(10_000_000),
	categories_ids: z.array(z.coerce.number().int().min(0))
});

export type Product_Create_Dto = Infer<typeof create_product_validator>;

export const update_product_validator = z.object({
	id: z.coerce.number().int().min(0),
	desc: z.string().min(4).max(36),
	bar_code: z.number().int().min(100_000_000_000).max(999_999_999_999),
	order_point: z.coerce.number().min(0).max(10_000_000),
	price: z.coerce.number().min(0).max(10_000_000),
	categories_ids: z.array(z.coerce.number().int().min(0))
});

export type Product_Update_Dto = Infer<typeof update_product_validator>;
