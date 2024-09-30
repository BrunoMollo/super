import { beforeEach, describe, expect, test } from 'vitest';
import { Category, create_category_validator } from '$lib/entities/category';
import { Authorized_User } from '$lib/entities/user';
import { Category_Controller } from '$lib/logic/category-controller';
import { Mock_Category_Repo } from '../mocks/mock-category-repo';

const admin = new Authorized_User(1, 'admin', 'admin', [{ id: 1, name: 'ADMIN' }]);
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

		const res = await category_ctrl.create(input, admin);
		expect(res.status).toBe('ok');

		//@ts-expect-error should be authorized
		const { output } = await category_ctrl.list_all(admin);
		expect(output.length).toBe(2);
	});

	test('if duplicated name, return error', async () => {
		const input = create_category_validator.parse({
			name: 'Lacteos'
		});
		const res = await category_ctrl.create(input, admin);
		expect(res.status).toBe('duplicated-name');

		//@ts-expect-error should be authorized
		const { output } = await category_ctrl.list_all(admin);
		expect(output.length).toBe(1);
	});
});
