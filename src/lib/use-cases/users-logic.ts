import type { Create_user_dto, User } from '$lib/entities/user';

export interface User_Repo {
	get_all(): Promise<User[]>;
	create(user: { username: string; password: string }): Promise<User>;
}

export class User_Controller {
	constructor(private user_repo: User_Repo) {}

	list_all() {
		return this.user_repo.get_all();
	}

	create(user: Create_user_dto) {
		return this.user_repo.create(user);
	}
}
