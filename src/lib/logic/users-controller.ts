import { type Edit_User_Dto, type User } from '$lib/entities/user';
import { err, ok_empty } from './helpers/results';
import type { User_Repo } from './ports/repos-interfaces';
import { type Unit_of_Work } from './ports/unit-of-work-interfaces';

export class User_Controller {
	constructor(
		private user_repo: User_Repo,
		private uow: Unit_of_Work
	) {}

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
