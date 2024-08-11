import { Category } from '$lib/entities/category';
import type { Category_Repo } from '$lib/use-cases/ports/i-category-repo';
import { Basic_Mock_Repo } from './basic-mock-repo';

export class Mock_Category_Repo extends Basic_Mock_Repo<Category> implements Category_Repo {
	async create(category: { name: string }): Promise<Category> {
		const id = this.arr.length;
		const name = category.name;
		const created = new Category(id, name);
		this.arr.push(created);
		return created;
	}
}
