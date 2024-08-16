import type { Create_Category_Dto } from '$lib/entities/category';
import { IntegrityError } from '$lib/errors';
import type { Category_Repo } from './ports/i-category-repo';
import type { Unit_of_Work } from './ports/i-unit-of-work';

export class Category_Controller {
	constructor(
		private category_repo: Category_Repo,
		private uow: Unit_of_Work
	) {}

	async list_all() {
		return this.category_repo.get_all();
	}

	async create(category: Create_Category_Dto) {
		return this.uow.do(async (repos) => {
			await repos.category_repo.create(category);
			return await repos.category_repo.create(category);
		});
		const match = await this.category_repo.get_by_name(category.name);
		if (match) {
			return new IntegrityError(`Duplicated name "${category.name}"`);
		}
		return this.category_repo.create(category);
	}
}
