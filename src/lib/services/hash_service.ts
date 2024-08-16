import type { Hash_Service } from '$lib/repos/user-repo-drizzle';

//TODO: add library
export class Hash_Service_IMPL implements Hash_Service {
	async check(x: string, y: string): Promise<{ pass: boolean }> {
		return { pass: true };
	}
	async hash(data: string): Promise<string> {
		return data;
	}
}
