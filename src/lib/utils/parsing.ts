/**
 * @description used to send classes though sveltekit load function (you can't just send a instanciated object)
 */
export function serilize<T extends object>(data: T) {
	if (data instanceof Array) {
		return data.map((item) => {
			if (item instanceof Object) {
				return { ...item };
			}
			return item;
		});
	} else {
		return { ...data };
	}
}
