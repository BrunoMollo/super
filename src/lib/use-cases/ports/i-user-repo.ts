import type { Role, User } from '$lib/entities/user';

export type Login_Response = { pass: true; user: User } | { pass: false };

export interface User_Repo {
	get_all(): Promise<User[]>;
	create(user: { username: string; password: string }): Promise<User>;
	validate(user: { username: string; password: string }): Promise<Login_Response>;
	add_role(data: { user_id: number; role_id: number }): Promise<Role>;
}
