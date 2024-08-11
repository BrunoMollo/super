export interface Basic_Repo<T extends { id: number }> {
	get_all(): Promise<T[]>;
	get_one(id: number): Promise<T | undefined>;
	remove(id: number): Promise<T | undefined>;
	update(user: T): Promise<T | undefined>;
}
