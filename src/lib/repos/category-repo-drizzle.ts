import { count, eq } from 'drizzle-orm';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';
import { t_category, t_product_has_category } from '$lib/server/drizzle/schema';

export class Category_Repo_Drizzle {
	constructor(private ctx: DB_Context) {}

	async create(category: { name: string }) {
		const { name } = category;
		const { id } = await this.ctx
			.insert(t_category)
			.values({ name })
			.returning({ id: t_category.id })
			.then((x) => x[0]);

		return id;
	}

	async get_by_name(name: string) {
		const result = await this.ctx
			.select()
			.from(t_category)
			.where(eq(t_category.name, name))
			.then((x) => x.at(0));

		if (!result) {
			return undefined;
		}

		const { id } = result;
		return { id, name };
	}

	async get_all() {
		return await this.ctx.select().from(t_category).orderBy(t_category.id);
	}

	async get_count_of_products_of_each_category() {
		return await this.ctx
			.select({ category_id: t_product_has_category.category_id, count: count() })
			.from(t_product_has_category)
			.groupBy(t_product_has_category.category_id);
	}

	async get_all_with_count() {
		const categories = await this.get_all().then((x) => x.map((x) => ({ ...x, count: 0 })));
		const bbb = await this.get_count_of_products_of_each_category();
		for (const category of categories) {
			const count = bbb.find((x) => x.category_id === category.id)?.count || 0;
			category.count = count;
		}
		return categories;
	}

	async get_one(id: number) {
		const result = await this.ctx
			.select()
			.from(t_category)
			.where(eq(t_category.id, id))
			.then((x) => x.at(0));

		if (!result) {
			return undefined;
		}

		const { name } = result;
		return { id, name };
	}

	async remove(id: number) {
		const can_delete = await this.ctx
			.select()
			.from(t_product_has_category)
			.where(eq(t_product_has_category.category_id, id))
			.then((x) => x.length === 0);

		if (can_delete) {
			await this.ctx.delete(t_category).where(eq(t_category.id, id));
		}

		return can_delete;
	}

	async update(modified: { id: number; name: string }) {
		const { id, name } = modified;
		const target = await this.get_one(id);
		if (target) {
			await this.ctx.update(t_category).set({ name }).where(eq(t_category.id, id));
		}
	}
}
