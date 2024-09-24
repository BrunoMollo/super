import type { Role, User } from '$lib/entities/user';

export interface Hash_Service {
	hash(data: string): Promise<string>;
	check(x: string, y: string): Promise<{ pass: boolean }>;
}

export type Payload = {
	id: number;
	username: string;
	roles: Role[];
};

export type Token_Validate_Res = { valid: false } | { valid: true; user: Payload };

export interface Token_Service {
	create_token(user: User): Promise<string>;
	get_max_age_seconds(): number;
	validate(token: string): Promise<Token_Validate_Res>;
}
