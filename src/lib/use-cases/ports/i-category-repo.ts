import type { Category } from '$lib/entities/category';
import type { Basic_Repo } from './i-basic-repo';

export interface Category_Repo extends Basic_Repo<Category> {
	create(category: { name: string }): Promise<Category>;
	get_by_name(name: string): Promise<Category | undefined>;
}
