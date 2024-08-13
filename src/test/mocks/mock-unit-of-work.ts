import type { TransactionDatabaseError } from '$lib/errors';
import type { Transacionalize, Unit_of_Work } from '$lib/logic/ports/i-unit-of-work';

export class Mock_Unit_of_Work implements Unit_of_Work {
	async do<R>(
		callback: (as_tx: Transacionalize, rollback: () => never) => R
	): Promise<R | TransactionDatabaseError> {
		const as_tx = <T>(x: T) => x;
		const rollback = () => {
			throw new Error('mock rollback');
		};

		return callback(as_tx, rollback);
	}
}
