import bcrypt from 'bcrypt';
import type { Hash_Service } from '$lib/logic/ports/services-interfaces';

export class Hash_Service_Bcrypt implements Hash_Service {
	async check(password: string, hash: string): Promise<{ pass: boolean }> {
		const pass = await bcrypt.compare(password, hash);
		return { pass };
	}

	async hash(data: string): Promise<string> {
		const salt = await bcrypt.genSalt(9);
		const hash = bcrypt.hash(data, salt);
		return hash;
	}
}
