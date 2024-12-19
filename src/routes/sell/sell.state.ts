import { fetch_product_by_bar_code } from './api/product/product.client';
import { fetch_submit_sell } from './api/sell/sell.client';
import { derived, readonly, writable } from 'svelte/store';

class SellState {
	private readonly listStore = writable(
		new Map<number, { id: number; desc: string; amount: number; price: number }>()
	);

	private products = [] as Array<{ product_id: number; quantity: number }>;
	constructor() {
		this.listStore.subscribe((x) => {
			this.products = Array.from(x.values()).map((x) => ({
				product_id: x.id,
				quantity: x.amount
			}));
		});
	}

	getProducts() {
		return this.products;
	}

	getListStore() {
		return readonly(this.listStore);
	}

	totalStore() {
		return derived(this.listStore, (x) =>
			Array.from(x.values()).reduce((acc, cur) => acc + cur.amount * cur.price, 0)
		);
	}

	add(product: { id: number; desc: string; price: number }, amount: number) {
		this.listStore.update((x) => {
			const existing = x.get(product.id);
			if (existing) {
				existing.amount += Number(amount);
			} else {
				x.set(product.id, { ...product, amount: Number(amount) });
			}
			return x;
		});
	}
}

class InputState {
	private readonly inputStore = writable({
		bar_code: '',
		amount: 1
	});

	private inputValue = { bar_code: '', amount: 1 };
	constructor() {
		this.inputStore.subscribe((x) => {
			this.inputValue = x;
		});
	}

	getCurrent() {
		return this.inputValue;
	}
	getStore() {
		return this.inputStore;
	}
	reset() {
		this.inputStore.set({ bar_code: '', amount: 1 });
	}
}

export function create_state_sell() {
	const input = new InputState();
	const sell_list = new SellState();

	async function search_product({ on_not_found }: { on_not_found: () => unknown }) {
		const { bar_code, amount } = input.getCurrent();

		const product = await fetch_product_by_bar_code(bar_code);
		if (!product) {
			return on_not_found();
		}
		sell_list.add(product, amount);
		input.reset();
	}

	async function submit_sell() {
		await fetch_submit_sell({
			products: sell_list.getProducts()
		});
	}

	return {
		input: input.getStore(),
		sell_list: derived(sell_list.getListStore(), (x) => Array.from(x.values())),
		total: sell_list.totalStore(),
		search_product,
		submit_sell
	};
}
