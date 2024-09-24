import { User } from '$lib/entities/user';
import { roles } from '$lib/entities/user';
import type { Login_Response, User_Repo } from '$lib/logic/ports/repos-interfaces';
import { Basic_Mock_Repo } from './basic-mock-repo';

export class Mock_User_Repo extends Basic_Mock_Repo<User> implements User_Repo {
	async add_role(data: { user_id: number; role_id: number }): Promise<void> {
		const role = roles.find((x) => x.id == data.role_id)!;
		const user = await this.get_one(data.user_id);
		if (user) {
			user.roles.push(role);
		}
	}

	async remove_all_roles(data: { user_id: number }): Promise<void> {
		const user = await this.get_one(data.user_id);
		if (user) {
			user.roles = [];
		}
	}

	async validate(creds: { username: string; password: string }): Promise<Login_Response> {
		const user = this.arr.find((x) => {
			if (x.username != creds.username) {
				return false;
			}
			if (x.password_hash != `hash(${creds.password})`) {
				return false;
			}
			return true;
		});
		if (user) {
			return { user, pass: true };
		}
		return { pass: false };
	}

	async create(data: { username: string; password: string }): Promise<User> {
		const id = this.arr.length;
		const user = new User(id, data.username, `hash(${data.password})`, []);
		this.arr.push(user);
		return user;
	}

	async get_by_username(username: string): Promise<User | undefined> {
		return this.arr.find((x) => x.username === username);
	}
}
