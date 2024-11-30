import { JWT_SECRET_KEY } from '$env/static/private';
import { SignJWT, jwtVerify } from 'jose';
import { Authorized_User, type Role } from '$lib/entities/user';

export type Payload = {
	id: number;
	username: string;
	roles: Role[];
};

export class JWT_Service {
	async validate(token: string) {
		const secret = new TextEncoder().encode(JWT_SECRET_KEY);
		try {
			const res = await jwtVerify(token, secret);
			const payload = res.payload as Payload;
			return { valid: true, user: payload } as const;
		} catch {
			return {
				valid: false
			} as const;
		}
	}

	create_token(user: Authorized_User): Promise<string> {
		const secret = new TextEncoder().encode(JWT_SECRET_KEY);
		const alg = 'HS256';
		const exp = `${this.get_max_age_minutes()}m`;
		const payload = {
			id: user.id,
			username: user.username,
			roles: user.roles
		} satisfies Payload;

		return new SignJWT(payload)
			.setProtectedHeader({ alg })
			.setExpirationTime(exp)
			.setIssuedAt()
			.setSubject(user.id.toString())
			.sign(secret);
	}

	get_max_age_seconds(): number {
		return 10_000;
	}
	get_max_age_minutes() {
		return this.get_max_age_seconds() / 60;
	}
}
