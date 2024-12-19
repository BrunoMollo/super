import { fetch_product_by_bar_code } from './api/product/product.client';
import { fetch_submit_sell } from './api/sell/sell.client';
import { derived, writable } from 'svelte/store';

export function create_state_sell() {
	const input = writable({
		bar_code: '',
		amount: 1
	});
	let $input = { bar_code: '', amount: 1 };
	input.subscribe((x) => ($input = x));

	const sell_list = writable(
		new Map<number, { id: number; desc: string; amount: number; price: number }>()
	);

	const total = derived(sell_list, (x) =>
		Array.from(x.values()).reduce((acc, cur) => acc + cur.amount * cur.price, 0)
	);

	async function search_product({ on_not_found }: { on_not_found: () => unknown }) {
		const { bar_code, amount } = $input;

		const product = await fetch_product_by_bar_code(bar_code);
		if (!product) {
			return on_not_found();
		}
		sell_list.update((x) => {
			const existing = x.get(product.id);
			if (existing) {
				existing.amount += Number(amount);
			} else {
				x.set(product.id, { ...product, amount: Number(amount) });
			}
			return x;
		});
		input.update(() => ({ bar_code: '', amount: 1 }));
	}

	let $products = [] as Array<{ product_id: number; quantity: number }>;
	sell_list.subscribe((x) => {
		$products = Array.from(x.values()).map((x) => ({
			product_id: x.id,
			quantity: x.amount
		}));
	});
	async function submit_sell() {
		await fetch_submit_sell({
			products: $products
		});
	}

	return {
		input,
		sell_list: derived(sell_list, (x) => Array.from(x.values())),
		total,
		search_product,
		submit_sell
	};
}
