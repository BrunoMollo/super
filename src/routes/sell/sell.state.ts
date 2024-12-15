import { fetch_product_by_bar_code } from './api/product/product.client';
import { readonly, writable } from 'svelte/store';

export function create_state_sell() {
	const input = writable({
		bar_code: '',
		amount: 1
	});
	let $input = { bar_code: '', amount: 1 };
	input.subscribe((x) => ($input = x));

	const sell_list = writable([] as { id: number; desc: string; amount: number }[]);

	async function search_product() {
		const { bar_code, amount } = $input;
		const product = await fetch_product_by_bar_code(bar_code);
		if (product) {
			sell_list.update((x) => [...x, { ...product, amount }]);
			input.update(() => ({ bar_code: '', amount: 1 }));
		}
	}

	return {
		input,
		sell_list: readonly(sell_list),
		search_product
	};
}
