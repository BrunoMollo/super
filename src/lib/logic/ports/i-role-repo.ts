import type { Role } from '$lib/entities/user';

export interface Role_Repo {
	get_all(): Promise<Role[]>;
	get_one(id: number): Promise<Role | undefined>;
	create(category: { id: number; name: string }): Promise<Role>;
}
