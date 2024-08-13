import type { TransactionDatabaseError } from '$lib/errors';

export type Transacionalize = <T>(repo: T) => T;

export interface Unit_of_Work {
	do<R>(
		callback: (as_tx: Transacionalize, rollback: () => never) => R
	): Promise<R | TransactionDatabaseError>;
}
