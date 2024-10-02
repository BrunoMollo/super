import { Authorized_User } from '$lib/entities/user';
import type { Token_Service, Token_Validate_Res } from '$lib/logic/ports/services-interfaces';

export class Mock_Token_Service implements Token_Service {
	async validate(token: string): Promise<Token_Validate_Res> {
		if (token.includes('token')) {
			return { valid: true, user: new Authorized_User(1, 'mock-user', []) };
		}
		return { valid: false };
	}
	async create_token(user: Authorized_User): Promise<string> {
		return `token(${user.id})`;
	}
	get_max_age_seconds(): number {
		return 10_000;
	}
}
