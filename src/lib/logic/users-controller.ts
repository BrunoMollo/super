import {
	type Create_user_dto,
	type Edit_User_Dto,
	type Login_dto,
	type User
} from '$lib/entities/user';
import { err, ok, ok_empty } from './helpers/results';
import type { User_Repo } from './ports/repos-interfaces';
import type { Token_Service } from './ports/services-interfaces';
import { type Unit_of_Work } from './ports/unit-of-work-interfaces';

export class User_Controller {
	constructor(
		private user_repo: User_Repo,
		private token_service: Token_Service,
		private uow: Unit_of_Work
	) {}

	async get_one(id: number, auth_user: User) {
		if (!auth_user.has_role('ADMIN')) {
			return err('unauthorized');
		}

		const user = await this.user_repo.get_one(id);
		if (!user) {
			return err('not-found');
		}
		return ok(user);
	}

	async list_all(auth_user: User) {
		if (!auth_user.has_role('ADMIN')) {
			return err('unauthorized');
		}

		const list = await this.user_repo.get_all();
		return ok(list);
	}

	async create(user: Create_user_dto, auth_user: User) {
		if (!auth_user.has_role('ADMIN')) {
			return err('unauthorized');
		}

		const match_username = await this.user_repo.get_by_username(user.username);
		if (match_username) {
			return err('duplicated-username');
		}

		await this.uow.do(async (repos) => {
			const new_user = await repos.user_repo.create(user);
			const user_id = new_user.id;

			for (const role_id of user.roles_id) {
				await repos.user_repo.add_role({ user_id, role_id });
			}
		});

		return ok_empty();
	}

	async login(creds: Login_dto) {
		const res = await this.user_repo.validate(creds);
		if (!res.pass) {
			return err('wrong-credentials');
		}
		const { user } = res;
		const token = await this.token_service.create_token(user);
		return ok({ token });
	}

	async edit(modified: Edit_User_Dto, auth_user: User) {
		if (!auth_user.has_role('ADMIN')) {
			return err('unauthorized');
		}
		const { user_id, roles_id } = modified;
		const user = await this.user_repo.get_one(user_id);
		if (!user) {
			return err('not-found');
		}
		await this.uow.do(async (repos) => {
			await repos.user_repo.remove_all_roles({ user_id });
			for (const role_id of roles_id) {
				await repos.user_repo.add_role({ user_id, role_id });
			}
		});
		return ok_empty();
	}
}
