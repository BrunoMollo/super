import { eq } from 'drizzle-orm';
import { Category } from '$lib/entities/category';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_category } from '$lib/server/drizzle/schema';
import type { Category_Repo } from '$lib/use-cases/ports/i-category-repo';

export class Category_Repo_Drizzle implements Category_Repo {
	constructor(private ctx: DB_Context) {}

	async create(category: { name: string }): Promise<Category> {
		const { name } = category;
		const { id } = await this.ctx
			.insert(t_category)
			.values({ name })
			.returning({ id: t_category.id })
			.then((x) => x[0]);

		return new Category(id, name);
	}

	async get_by_name(name: string): Promise<Category | undefined> {
		const result = await this.ctx
			.select()
			.from(t_category)
			.where(eq(t_category.name, name))
			.then((x) => x.at(0));

		if (!result) {
			return undefined;
		}

		const { id } = result;
		return new Category(id, name);
	}

	get_all(): Promise<Category[]> {
		return this.ctx.select().from(t_category);
	}

	async get_one(id: number): Promise<Category | undefined> {
		const result = await this.ctx
			.select()
			.from(t_category)
			.where(eq(t_category.id, id))
			.then((x) => x.at(0));

		if (!result) {
			return undefined;
		}

		const { name } = result;
		return new Category(id, name);
	}

	remove(id: number): Promise<Category | undefined> {
		throw new Error('Method not implemented.');
	}

	update(user: Category): Promise<Category | undefined> {
		throw new Error('Method not implemented.');
	}
}
