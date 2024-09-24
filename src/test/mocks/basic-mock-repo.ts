export abstract class Basic_Mock_Repo<T extends { id: number }> {
	constructor(protected arr: T[]) {}

	async get_all(): Promise<T[]> {
		return this.arr;
	}

	async get_one(id: number): Promise<T | undefined> {
		return this.arr.find((x) => x.id === id);
	}

	async remove(id: number): Promise<T | undefined> {
		const target = await this.get_one(id);
		this.arr = this.arr.filter((x) => x.id !== id);
		return target;
	}

	async update(user: T): Promise<void> {
		const index = this.arr.findIndex((x) => x.id === user.id);
		if (index === -1) {
			return undefined;
		}
		this.arr[index] = user;
	}
}
