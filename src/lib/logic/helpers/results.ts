export function ok<const T>(output: T) {
	return { status: 'ok', output } as const;
}

export function err<const E extends string, const T>(err: E, data: T) {
	return { status: err, output: data } as const;
}

export function exaust(res: never): never {
	throw new Error('Should not reach this point ' + JSON.stringify(res));
}
