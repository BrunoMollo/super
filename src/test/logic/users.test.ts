import { beforeEach, describe, expect, test } from 'vitest';
import { User, create_user_validator } from '$lib/entities/user';
import { IntegrityError } from '$lib/errors';
import { User_Controller } from '$lib/logic/users-controller';
import { JWT_Service } from '$lib/services/jwt_service';
import { Mock_User_Repo } from '../mocks/mock-user-repo';

let user_ctrl: User_Controller;

beforeEach(() => {
	const data = [new User(1, 'bruno', 'some-psw', [{ id: 1, name: 'ADMIN' }])];
	const mock = new Mock_User_Repo(data);
	const token_service = new JWT_Service();
	user_ctrl = new User_Controller(mock, token_service);
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
