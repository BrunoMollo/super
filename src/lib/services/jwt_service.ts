import { JWT_SECRET_KEY } from '$env/static/private';
import { SignJWT, jwtVerify } from 'jose';
import { User } from '$lib/entities/user';
import type { Payload, Token_Service, Token_Validate_Res } from '$lib/logic/ports/i-token-service';

export class JWT_Service implements Token_Service {
	async validate(token: string): Promise<Token_Validate_Res> {
		const secret = new TextEncoder().encode(JWT_SECRET_KEY);
		try {
			const res = await jwtVerify(token, secret);
			const payload = res.payload as Payload;
			return { valid: true, user: payload } as const;
		} catch {
			return {
				valid: false
			};
		}
	}

	create_token(user: User): Promise<string> {
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
