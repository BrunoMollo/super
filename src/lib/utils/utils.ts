export function round(num: number, decimals = 2) {
	const multiplier = Math.pow(10, decimals);
	return Math.trunc(num * multiplier) / multiplier;
}
