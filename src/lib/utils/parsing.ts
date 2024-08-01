/**
 * @description used to send classes though sveltekit load function (you can't just send a instanciated object)
 */
export function serilize<T>(arr: T[]) {
	return arr.map((item) => {
		if (item instanceof Object) {
			return { ...item };
		}
		return item;
	});
}
