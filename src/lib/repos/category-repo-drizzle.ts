import { eq } from 'drizzle-orm';
import { Category } from '$lib/entities/category';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_category } from '$lib/server/drizzle/schema';

export class Category_Repo_Drizzle {
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
		return this.ctx.select().from(t_category).orderBy(t_category.id);
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

	async remove(id: number): Promise<Category | undefined> {
		const target = await this.get_one(id);
		if (target) {
			await this.ctx.delete(t_category).where(eq(t_category.id, id));
		}
		return target;
	}

	async update(modified: Category): Promise<void> {
		const { id, name } = modified;
		const target = await this.get_one(id);
		if (target) {
			await this.ctx.update(t_category).set({ name }).where(eq(t_category.id, id));
			new Category(id, name);
		}
	}
}
