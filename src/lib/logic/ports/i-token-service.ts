import type { Authorized_User, Role } from '$lib/entities/user';

export type Payload = {
	id: number;
	username: string;
	roles: Role[];
};

export type Token_Validate_Res = { valid: false } | { valid: true; user: Payload };

export interface Token_Service {
	create_token(user: Authorized_User): Promise<string>;
	get_max_age_seconds(): number;
	validate(token: string): Promise<Token_Validate_Res>;
}
