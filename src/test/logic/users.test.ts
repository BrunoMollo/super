import { beforeEach, describe, expect, test } from 'vitest';
import { edit_user_validator, login_validator } from '$lib/entities/user';
import { User, create_user_validator } from '$lib/entities/user';
import { IntegrityError, LoginError, NotFoundError } from '$lib/errors';
import { User_Controller } from '$lib/logic/users-controller';
import { Mock_Token_Service } from '../mocks/mock-token-service';
import { Mock_Unit_of_Work } from '../mocks/mock-unit-of-work';
import { Mock_User_Repo } from '../mocks/mock-user-repo';

let user_ctrl: User_Controller;

beforeEach(() => {
	const data = [new User(1, 'bruno', 'some-psw', [{ id: 1, name: 'ADMIN' }])];
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
		const res = await user_ctrl.create(bruno);
		expect(res).instanceof(User);
		const all = await user_ctrl.list_all();
		expect(all.length).toBe(2);
	});
	test('if duplicated username, return error', async () => {
		const bruno = create_user_validator.parse({
			username: 'bruno',
			password: '1234',
			roles_id: [1]
		});
		const res = await user_ctrl.create(bruno);
		expect(res).instanceof(IntegrityError);
		const all = await user_ctrl.list_all();
		expect(all.length).toBe(1);
	});
});

describe('user login', () => {
	test('happy path', async () => {
		//Create
		const admin = create_user_validator.parse({
			username: 'admin',
			password: '1234',
			roles_id: [1]
		});
		await user_ctrl.create(admin);

		//Login
		const creds = login_validator.parse({
			username: 'admin',
			password: '1234'
		});
		const res = await user_ctrl.login(creds);
		expect(res).not.instanceof(LoginError);
		expect(res).toHaveProperty('token', 'token(1)');
	});
	test('reject login (wrong password)', async () => {
		//Create
		const admin = create_user_validator.parse({
			username: 'admin',
			password: '1234',
			roles_id: [1]
		});
		await user_ctrl.create(admin);

		//Login
		const creds = login_validator.parse({
			username: 'admin',
			password: '4321 (wrong)'
		});
		const res = await user_ctrl.login(creds);
		expect(res).instanceof(LoginError);
		expect(res).not.toHaveProperty('token');
	});

	test('reject login (wrong username)', async () => {
		//Create
		const admin = create_user_validator.parse({
			username: 'admin',
			password: '1234',
			roles_id: [1]
		});
		await user_ctrl.create(admin);

		//Login
		const creds = login_validator.parse({
			username: 'someone else',
			password: '1234'
		});
		const res = await user_ctrl.login(creds);
		expect(res).instanceof(LoginError);
		expect(res).not.toHaveProperty('token');
	});
});

describe('user edition', () => {
	test('happy path (1)->(1,2)', async () => {
		const modified = edit_user_validator.parse({
			user_id: 1,
			roles_id: [1, 2]
		});
		const res_edit = await user_ctrl.edit(modified);
		expect(res_edit).toBe(undefined);
		const check = (await user_ctrl.get_one(1)) as User;
		expect(check.roles.map((x) => x.id)).toEqual([1, 2]);
	});

	test('happy path (1)->(2)', async () => {
		const modified = edit_user_validator.parse({
			user_id: 1,
			roles_id: [2]
		});
		const res_edit = await user_ctrl.edit(modified);
		expect(res_edit).toBe(undefined);
		const check = (await user_ctrl.get_one(1)) as User;
		expect(check.roles.map((x) => x.id)).toEqual([2]);
	});

	test('happy path (1)->()', async () => {
		const modified = edit_user_validator.parse({
			user_id: 1,
			roles_id: []
		});
		const res_edit = await user_ctrl.edit(modified);
		expect(res_edit).toBe(undefined);
		const check = (await user_ctrl.get_one(1)) as User;
		expect(check.roles.map((x) => x.id)).toEqual([]);
	});

	test('user not found', async () => {
		const modified = edit_user_validator.parse({
			user_id: 100000,
			roles_id: [1, 2]
		});
		const res_edit = await user_ctrl.edit(modified);
		expect(res_edit).toBeInstanceOf(NotFoundError);
		const check = (await user_ctrl.get_one(1)) as User;
		expect(check.roles.map((x) => x.id)).toEqual([1]);
	});
});
