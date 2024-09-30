import { beforeEach, describe, expect, test } from 'vitest';
import { edit_user_validator, login_validator } from '$lib/entities/user';
import { Authorized_User, create_user_validator } from '$lib/entities/user';
import { User_Controller } from '$lib/logic/users-controller';
import { Mock_Token_Service } from '../mocks/mock-token-service';
import { Mock_Unit_of_Work } from '../mocks/mock-unit-of-work';
import { Mock_User_Repo } from '../mocks/mock-user-repo';

let user_ctrl: User_Controller;
const admin = new Authorized_User(1, 'admin', [{ id: 1, name: 'ADMIN' }]);

beforeEach(() => {
	const data = [new Authorized_User(1, 'bruno', [{ id: 1, name: 'ADMIN' }])];
	const mock_repo = new Mock_User_Repo(data);
	const mock_uow = new Mock_Unit_of_Work();
	mock_uow.user_repo = mock_repo;
	const token_service = new Mock_Token_Service();
	user_ctrl = new User_Controller(mock_repo, token_service, mock_uow);
});

describe('user creation', () => {
	test('happy path', async () => {
		const bruno = create_user_validator.parse({
			username: 'faus',
			password: '1234',
			roles_id: [1]
		});

		const res = await user_ctrl.create(bruno, admin);
		expect(res.status).toBe('ok');

		//@ts-expect-error should be authorized
		const { output } = await user_ctrl.list_all(admin);
		expect(output.length).toBe(2);
	});
	test('if duplicated username, return error', async () => {
		const bruno = create_user_validator.parse({
			username: 'bruno',
			password: '1234',
			roles_id: [1]
		});

		const res = await user_ctrl.create(bruno, admin);
		expect(res.status).toBe('duplicated-username');

		//@ts-expect-error should be authorized
		const { output } = await user_ctrl.list_all(admin);
		expect(output.length).toBe(1);
	});
});

describe('user login', () => {
	test('happy path', async () => {
		//Create
		const input = create_user_validator.parse({
			username: 'admin',
			password: '1234',
			roles_id: [1]
		});
		await user_ctrl.create(input, admin);

		//Login
		const creds = login_validator.parse({
			username: 'admin',
			password: '1234'
		});
		const res = await user_ctrl.login(creds);
		expect(res.status).toBe('ok');

		if (res.status == 'ok') {
			expect(res.output.token).toBe('token(1)');
		}
	});
	test('reject login (wrong password)', async () => {
		//Create
		const input = create_user_validator.parse({
			username: 'admin',
			password: '1234',
			roles_id: [1]
		});
		await user_ctrl.create(input, admin);

		//Login
		const creds = login_validator.parse({
			username: 'admin',
			password: '4321 (wrong)'
		});
		const res = await user_ctrl.login(creds);
		expect(res.status).toBe('wrong-credentials');
	});

	test('reject login (wrong username)', async () => {
		//Create
		const input = create_user_validator.parse({
			username: 'admin',
			password: '1234',
			roles_id: [1]
		});
		await user_ctrl.create(input, admin);

		//Login
		const creds = login_validator.parse({
			username: 'someone else',
			password: '1234'
		});
		const res = await user_ctrl.login(creds);
		expect(res.status).toBe('wrong-credentials');
	});
});

describe('user edition', () => {
	test('happy path (1)->(1,2)', async () => {
		const modified = edit_user_validator.parse({
			user_id: 1,
			roles_id: [1, 2]
		});
		const res_edit = await user_ctrl.edit(modified, admin);
		expect(res_edit.status).toBe('ok');

		const res_check = await user_ctrl.get_one(1, admin);
		expect(res_check.status).toBe('ok');
		if (res_check.status == 'ok') {
			const user = res_check.output;
			expect(user.roles.map((x) => x.id)).toEqual([1, 2]);
		}
	});

	test('happy path (1)->(2)', async () => {
		const modified = edit_user_validator.parse({
			user_id: 1,
			roles_id: [2]
		});
		const res_edit = await user_ctrl.edit(modified, admin);
		expect(res_edit.status).toBe('ok');

		const res_check = await user_ctrl.get_one(1, admin);
		expect(res_check.status).toBe('ok');
		if (res_check.status == 'ok') {
			const user = res_check.output;
			expect(user.roles.map((x) => x.id)).toEqual([2]);
		}
	});

	test('happy path (1)->()', async () => {
		const modified = edit_user_validator.parse({
			user_id: 1,
			roles_id: []
		});
		const res_edit = await user_ctrl.edit(modified, admin);
		expect(res_edit.status).toBe('ok');

		const res_check = await user_ctrl.get_one(1, admin);
		expect(res_check.status).toBe('ok');
		if (res_check.status == 'ok') {
			const user = res_check.output;
			expect(user.roles.map((x) => x.id)).toEqual([]);
		}
	});

	test('user not found', async () => {
		const modified = edit_user_validator.parse({
			user_id: 100000,
			roles_id: [1, 2]
		});

		const res = await user_ctrl.edit(modified, admin);
		expect(res.status).toBe('not-found');
	});
});
