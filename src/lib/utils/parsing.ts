/**
 * @description used to send classes though
 * sveltekit load function (you can't just send a instanciated object)
 */
export function serilize<T extends object>(arr: T[]) {
	return arr.map((item) => {
		if (item instanceof Object) {
			return { ...item };
		}
		return item;
	});
}

/**
 * @description used to send classes though
 * sveltekit load function (you can't just send a instanciated object)
 */
export function serilize_one<T extends object>(arr: T) {
	return { ...arr };
}
