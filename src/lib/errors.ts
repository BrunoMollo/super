import { error } from '@sveltejs/kit';

export function handel_error(err: unknown) {
	if (err instanceof CustomError) {
		return error(err.status, err.message);
	}
	throw err;
}

export abstract class CustomError extends Error {
	constructor(
		public message: string,
		public status: number
	) {
		super();
	}
}

export class IntegrityError extends CustomError {
	constructor(message: string) {
		const status = 400 as const;
		super(message, status);
	}
}

export class TransactionDatabaseError extends CustomError {
	constructor(message: string) {
		const status = 500 as const;
		super(message, status);
	}
}

export class AuthenticationError extends CustomError {
	constructor(message?: string) {
		const base = 'You must be logged in to view this content' as const;
		const status = 401 as const;
		super(message ?? base, status);
	}
}

export class NotFoundError extends CustomError {
	constructor({ resource }: { resource: string }) {
		const base = `Not Found: ${resource}` as const;
		const status = 404 as const;
		super(base, status);
	}
}

export class LoginError extends CustomError {
	constructor() {
		const base = 'Invalid email or password' as const;
		const status = 401 as const;
		super(base, status);
	}
}
