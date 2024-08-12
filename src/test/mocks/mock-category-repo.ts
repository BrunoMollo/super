import { Category } from '$lib/entities/category';
import type { Category_Repo } from '$lib/logic/ports/i-category-repo';
import { Basic_Mock_Repo } from './basic-mock-repo';

export class Mock_Category_Repo extends Basic_Mock_Repo<Category> implements Category_Repo {
	async get_by_name(name: string): Promise<Category | undefined> {
		return this.arr.find((x) => x.name === name);
	}

	async create(category: { name: string }): Promise<Category> {
		const id = this.arr.length;
		const name = category.name;
		const created = new Category(id, name);
		this.arr.push(created);
		return created;
	}
}
