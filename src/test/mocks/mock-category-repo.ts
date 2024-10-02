import { Category } from '$lib/entities/category';
import type { Category_Repo } from '$lib/logic/ports/repos-interfaces';

export class Mock_Category_Repo implements Category_Repo {
	constructor(protected arr: Category[]) {}

	async get_one(id: number): Promise<Category | undefined> {
		return this.arr.find((x) => x.id === id);
	}

	async get_all(): Promise<Category[]> {
		return this.arr;
	}

	async update(modified: Category): Promise<void> {
		throw new Error('Method not implemented.' + modified);
	}

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
