import { beforeEach, describe, expect, test } from 'vitest';
import { Category, create_category_validator } from '$lib/entities/category';
import { IntegrityError } from '$lib/errors';
import { Category_Controller } from '$lib/logic/category-controller';
import { Mock_Category_Repo } from '../mocks/mock-category-repo';

let category_ctrl: Category_Controller;
beforeEach(() => {
	const data = [new Category(1, 'Lacteos')];
	const mock_repo = new Mock_Category_Repo(data);
	category_ctrl = new Category_Controller(mock_repo);
});
describe('create category', () => {
	test('happy path', async () => {
		const input = create_category_validator.parse({
			name: 'Carnes'
		});

		const res = await category_ctrl.create(input);
		expect(res).instanceof(Category);
		const all = await category_ctrl.list_all();
		expect(all.length).toBe(2);
	});

	test('if duplicated name, return error', async () => {
		const input = create_category_validator.parse({
			name: 'Lacteos'
		});

		const res = await category_ctrl.create(input);
		expect(res).instanceof(IntegrityError);
		const all = await category_ctrl.list_all();
		expect(all.length).toBe(1);
	});
});
