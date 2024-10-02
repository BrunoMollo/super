import type { Category } from '$lib/entities/category';
import type { Authorized_User } from '$lib/entities/user';
import type { Role } from '$lib/entities/user';

export type Login_Response = { pass: true; user: Authorized_User } | { pass: false };

export interface User_Repo {
	get_one(id: number): Promise<Authorized_User | undefined>;
	get_all(): Promise<Authorized_User[]>;
	create(user: { username: string; password: string }): Promise<Authorized_User>;
	validate(user: { username: string; password: string }): Promise<Login_Response>;
	add_role(data: { user_id: number; role_id: number }): Promise<void>;
	remove_all_roles(data: { user_id: number }): Promise<void>;
	get_by_username(username: string): Promise<Authorized_User | undefined>;
}

export interface Role_Repo {
	get_one(id: number): Promise<Role | undefined>;
	get_all(): Promise<Role[]>;
	get_one(id: number): Promise<Role | undefined>;
	create(category: { id: number; name: string }): Promise<number>;
}

export interface Category_Repo {
	get_one(id: number): Promise<Category | undefined>;
	get_all(): Promise<Category[]>;
	create(category: { name: string }): Promise<Category>;
	get_by_name(name: string): Promise<Category | undefined>;
	update(modified: Category): Promise<void>;
}
