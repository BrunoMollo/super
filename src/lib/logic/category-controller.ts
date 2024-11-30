import type { Edit_Cateogory_Dto } from '$lib/entities/category';
import type { User } from '$lib/entities/user';
import { err, ok_empty } from './helpers/results';
import type { Category_Repo } from './ports/repos-interfaces';

export class Category_Controller {
	constructor(private category_repo: Category_Repo) {}

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
