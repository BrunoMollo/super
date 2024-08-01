import type { Create_user_dto, Login_dto, User } from '$lib/entities/user';
import { LoginError } from '$lib/errors';

export type Login_Response = { pass: true; user: User } | { pass: false };
export interface User_Repo {
	get_all(): Promise<User[]>;
	create(user: { username: string; password: string }): Promise<User>;
	validate(user: { username: string; password: string }): Promise<Login_Response>;
}

export class User_Controller {
	constructor(private user_repo: User_Repo) {}

	list_all() {
		return this.user_repo.get_all();
	}

	create(user: Create_user_dto) {
		return this.user_repo.create(user);
	}

	async login(creds: Login_dto) {
		const res = await this.user_repo.validate(creds);
		if (!res.pass) {
			return new LoginError();
		}
		return res.user;
	}
}
