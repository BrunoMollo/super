import type { Create_Category_Dto, Edit_Cateogory_Dto } from '$lib/entities/category';
import { IntegrityError, NotFoundError } from '$lib/errors';
import type { Category_Repo } from './ports/i-category-repo';

export class Category_Controller {
	constructor(private category_repo: Category_Repo) {}

	/**
	 * @throws {NotFoundError}
	 */
	async get_one(id: number) {
		const category = await this.category_repo.get_one(id);
		if (!category) {
			throw new NotFoundError({ resource: 'category' });
		}
		return category;
	}

	async list_all() {
		return this.category_repo.get_all();
	}

	/**
	 * @throws {IntegrityError}
	 */
	async create(category: Create_Category_Dto) {
		const match = await this.category_repo.get_by_name(category.name);
		if (match) {
			throw new IntegrityError(`Duplicated name "${category.name}"`);
		}
		return this.category_repo.create(category);
	}

	/**
	 * @throws {NotFoundError}
	 */
	async edit(input: Edit_Cateogory_Dto) {
		const { id, name } = input;
		const category = await this.category_repo.get_one(id);
		if (!category) {
			throw new NotFoundError({ resource: 'category' });
		}
		await this.category_repo.update({ id, name });
	}
}
