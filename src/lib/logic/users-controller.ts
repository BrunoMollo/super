import { type Create_user_dto, type Edit_User_Dto, type Login_dto } from '$lib/entities/user';
import { IntegrityError, LoginError, NotFoundError } from '$lib/errors';
import type { Token_Service } from './ports/i-token-service';
import type { Unit_of_Work } from './ports/i-unit-of-work';
import type { User_Repo } from './ports/i-user-repo';

export class User_Controller {
	constructor(
		private user_repo: User_Repo,
		private token_service: Token_Service,
		private uow: Unit_of_Work
	) {}

	get_one(id: number) {
		return this.user_repo.get_one(id);
	}

	async list_all() {
		const list = await this.user_repo.get_all();
		return list;
	}

	async create(user: Create_user_dto) {
		const match_username = await this.user_repo.get_by_username(user.username);
		if (match_username) {
			return new IntegrityError(`Duplicated username "${user.username}"`);
		}

		return await this.uow.do(async (repos) => {
			const new_user = await repos.user_repo.create(user);
			const user_id = new_user.id;

			for (const role_id of user.roles_id) {
				await repos.user_repo.add_role({ user_id, role_id });
			}

			return new_user;
		});
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

	async edit(modified: Edit_User_Dto) {
		const { user_id, roles_id } = modified;
		const user = await this.user_repo.get_one(user_id);
		if (!user) {
			return new NotFoundError('User not Found');
		}
		return await this.uow.do(async (repos) => {
			await repos.user_repo.remove_all_roles({ user_id });
			for (const role_id of roles_id) {
				await repos.user_repo.add_role({ user_id, role_id });
			}
		});
	}
}
