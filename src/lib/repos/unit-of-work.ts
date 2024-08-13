import { TransactionDatabaseError } from '$lib/errors';
import type { Transacionalize, Unit_of_Work } from '$lib/logic/ports/i-unit-of-work';
import type { DB_Context } from '$lib/server/drizzle/drizzle-client';

export class Unit_of_Work_Drizzle implements Unit_of_Work {
	constructor(private ctx: DB_Context) {}
	private get_constructor(obj: unknown) {
		return Object.getPrototypeOf(obj).constructor;
	}

	async do<R>(callback: (as_tx: Transacionalize, rollback: () => never) => R) {
		try {
			return await this.ctx.transaction(async (tx) => {
				const transactionize = <T>(repo: T) => {
					const Repo_Constructor = this.get_constructor(repo);
					const copy = new Repo_Constructor(tx);
					return copy as T;
				};
				return callback(transactionize, tx.rollback);
			});
		} catch (err) {
			console.log(err);
			const msj = JSON.stringify(err);
			return new TransactionDatabaseError(msj);
		}
	}
}
