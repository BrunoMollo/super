import type { Create_Category_Dto } from '$lib/entities/category';
import { IntegrityError } from '$lib/errors';
import type { Category_Repo } from './ports/i-category-repo';

export class Category_Controller {
	constructor(private category_repo: Category_Repo) {}

	async list_all() {
		return this.category_repo.get_all();
	}

	async create(category: Create_Category_Dto) {
		const match = await this.category_repo.get_by_name(category.name);
		if (match) {
			return new IntegrityError(`Category with name ${category.name} already exist`);
		}
		return this.category_repo.create(category);
	}
}
