import type { Create_user_dto, Login_dto } from '$lib/entities/user';
import { IntegrityError, LoginError } from '$lib/errors';
import type { Token_Service } from './ports/i-token-service';
import type { User_Repo } from './ports/i-user-repo';

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
		const match_username = await this.user_repo.get_by_username(user.username);
		if (match_username) {
			return new IntegrityError(`Duplicated username "${user.username}"`);
		}

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
