import type { User } from '$lib/entities/user';
import type { Basic_Repo } from './i-basic-repo';

export type Login_Response = { pass: true; user: User } | { pass: false };

export interface User_Repo extends Basic_Repo<User> {
	get_all(): Promise<User[]>;
	create(user: { username: string; password: string }): Promise<User>;
	validate(user: { username: string; password: string }): Promise<Login_Response>;
	add_role(data: { user_id: number; role_id: number }): Promise<void>;
	remove_all_roles(data: { user_id: number }): Promise<void>;
	get_by_username(username: string): Promise<User | undefined>;
}
