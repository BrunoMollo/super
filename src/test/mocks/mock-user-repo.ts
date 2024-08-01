import { User } from '$lib/entities/user';
import type { Login_Response, User_Repo } from '$lib/use-cases/users-logic';

export class Mock_User_Repo implements User_Repo {
	constructor(private arr: User[]) {}
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

	async get_all(): Promise<User[]> {
		return this.arr;
	}

	async create(data: { username: string; password: string }): Promise<User> {
		const id = this.arr.length;
		const user = new User(id, data.username, `hash(${data.password})`, []);
		this.arr.push(user);
		return user;
	}
}
