export function ok_empty() {
	return { status: 'ok' } as const;
}

export function ok<const T>(output: T) {
	return { status: 'ok', output } as const;
}

type ExcludeOK<T> = T & (T extends 'ok' ? never : T);

export function err<const Err extends string>(err: ExcludeOK<Err>) {
	return { status: err } as const;
}

export function err_d<const Err extends string, const Data>(err: ExcludeOK<Err>, data: Data) {
	return { status: err, output: data } as const;
}

export function exaust(res: never): never {
	throw new Error('Should not reach this point ' + JSON.stringify(res));
}
