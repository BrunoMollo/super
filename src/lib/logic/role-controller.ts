import type { Role_Repo } from './ports/i-role-repo';

export class Role_Controller {
	constructor(private roles_repo: Role_Repo) {}

	async create_or_skip(data: { id: number; name: string }) {
		const { id, name } = data;
		const exists = !!(await this.roles_repo.get_one(id));
		if (!exists) {
			this.roles_repo.create({ id, name });
		}
	}
}
