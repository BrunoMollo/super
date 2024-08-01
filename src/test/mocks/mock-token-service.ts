import { User } from '$lib/entities/user';
import type { Token_Service, Token_Validate_Res } from '$lib/use-cases/users-logic';

export class Mock_Token_Service implements Token_Service {
	validate(token: string): Token_Validate_Res {
		if (token.includes('token')) {
			return { valid: true, user: new User(1, '', '', []) };
		}
		return { valid: false };
	}
	create_token(user: User): string {
		return `token(${user.id})`;
	}
	get_max_age_seconds(): number {
		return 10_000;
	}
}
