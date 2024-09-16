import { error } from '@sveltejs/kit';

export function handel_error(err: unknown) {
	if (err instanceof PublicError) {
		return error(err.status, err.message);
	}
	throw err;
}

export abstract class PublicError extends Error {
	constructor(
		public message: string,
		public status: number
	) {
		super();
	}
}

export class IntegrityError extends PublicError {
	constructor(message: string) {
		const status = 400 as const;
		super(message, status);
	}
}

export class TransactionDatabaseError extends PublicError {
	constructor(message: string) {
		const status = 500 as const;
		super(message, status);
	}
}

export class AuthenticationError extends PublicError {
	constructor(message?: string) {
		const base = 'You must be logged in to view this content' as const;
		const status = 401 as const;
		super(message ?? base, status);
	}
}

export class NotFoundError extends PublicError {
	constructor(message: string) {
		const base = 'Resource Not Found' as const;
		const status = 404 as const;
		super(message ?? base, status);
	}
}

export class LoginError extends PublicError {
	constructor() {
		const base = 'Invalid email or password' as const;
		const status = 401 as const;
		super(base, status);
	}
}
