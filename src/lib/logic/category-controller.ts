import type { Create_Category_Dto, Edit_Cateogory_Dto } from '$lib/entities/category';
import type { User } from '$lib/entities/user';
import { err, ok, ok_empty } from './helpers/results';
import type { Category_Repo } from './ports/i-category-repo';

export class Category_Controller {
	constructor(private category_repo: Category_Repo) {}

	async get_one(id: number, user: User) {
		if (!user.has_role('ADMIN')) {
			return err('unauthorized');
		}

		const category = await this.category_repo.get_one(id);
		if (!category) {
			return err('not-found');
		}
		return ok(category);
	}

	async list_all(user: User) {
		if (!user.has_role('ADMIN')) {
			return err('unauthorized');
		}
		const list = await this.category_repo.get_all();
		return ok(list);
	}

	async create(category: Create_Category_Dto, user: User) {
		if (!user.has_role('ADMIN')) {
			return err('unauthorized');
		}
		const match = await this.category_repo.get_by_name(category.name);
		if (match) {
			return err('duplicated-name');
		}
		const created = await this.category_repo.create(category);
		return ok(created);
	}

	async edit(input: Edit_Cateogory_Dto, user: User) {
		if (!user.has_any_role(['ADMIN'])) {
			return err('unauthorized');
		}
		const { id, name } = input;
		const category = await this.category_repo.get_one(id);
		if (!category) {
			return err('not-found');
		}

		const match = await this.category_repo.get_by_name(category.name);
		if (match) {
			return err('duplicated-name');
		}

		await this.category_repo.update({ id, name });
		return ok_empty();
	}
}
