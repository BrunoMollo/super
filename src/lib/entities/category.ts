export class Category {
	constructor(
		public id: number,
		public name: string
	) {}
}

//
// Validators
//

export const create_category_validator = z
	.object({
		name: z.string().min(4).max(36)
	})
	.brand('create_category_validator_dto');

export type Create_Category_Dto = Infer<typeof create_category_validator>;
