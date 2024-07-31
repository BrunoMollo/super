import { User } from '$lib/entities/user';
import type { User_Repo } from '$lib/use-cases/users-logic';

export class Mock_User_Repo implements User_Repo {
	constructor(private arr: User[]) {}

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
