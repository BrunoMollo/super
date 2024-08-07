import type { Create_user_dto, Login_dto, Role, User } from '$lib/entities/user';
import { LoginError } from '$lib/errors';

export type Login_Response = { pass: true; user: User } | { pass: false };
export interface User_Repo {
	get_all(): Promise<User[]>;
	create(user: { username: string; password: string }): Promise<User>;
	validate(user: { username: string; password: string }): Promise<Login_Response>;
	add_role(data: { user_id: number; role_id: number }): Promise<Role>;
}

export type Payload = {
	id: number;
	username: string;
	roles: Role[];
};
export type Token_Validate_Res = { valid: false } | { valid: true; user: Payload };
export interface Token_Service {
	create_token(user: User): Promise<string>;
	get_max_age_seconds(): number;
	validate(token: string): Promise<Token_Validate_Res>;
}

export class User_Controller {
	constructor(
		private user_repo: User_Repo,
		private token_service: Token_Service
	) {}

	async list_all() {
		const list = await this.user_repo.get_all();
		return list;
	}

	async create(user: Create_user_dto) {
		const new_user = await this.user_repo.create(user);
		const user_id = new_user.id;

		for (const role_id of user.roles_id) {
			await this.user_repo.add_role({ user_id, role_id });
		}
		return new_user;
	}

	async login(creds: Login_dto) {
		const res = await this.user_repo.validate(creds);
		if (!res.pass) {
			return new LoginError();
		}
		const { user } = res;
		const token = await this.token_service.create_token(user);
		return { token };
	}
}
