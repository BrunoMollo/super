import { fetch_if_exits_with_dni } from './api/client/client.client';
import { fetch_product_by_bar_code } from './api/product/product.client';
import { fetch_submit_sell } from './api/sell/sell.client';
import { derived, readonly, writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';

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

	remove_product_from_sell(id: number) {
		this.listStore.update((x) => {
			//eslint-disable-next-line drizzle/enforce-delete-with-where
			x.delete(id);
			return x;
		});
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

	reset() {
		this.listStore.set(new Map());
	}
}

class InputState {
	private static default_value() {
		return {
			bar_code: '',
			amount: 1,
			client: {
				dni: '',
				first_name: '',
				last_name: '',
				email: '',
				_exits: 'PENDING' as boolean | 'PENDING',
				_ok: false
			}
		};
	}

	private inputValue = structuredClone(InputState.default_value());
	private readonly inputStore = writable(structuredClone(InputState.default_value()));

	constructor() {
		this.inputStore.subscribe((x) => {
			if (this.inputValue.client.dni !== x.client.dni) {
				this.set_client_as_pending();
			}

			this.inputValue = structuredClone(x);
		});
	}

	getCurrent() {
		return this.inputValue;
	}
	getStore() {
		return this.inputStore;
	}
	reset() {
		this.inputStore.set(InputState.default_value());
	}
	set_client_as_not_existing() {
		this.inputStore.update((x) => {
			x.client._exits = false;
			return x;
		});
	}
	set_client_as_existing() {
		this.inputStore.update((x) => {
			x.client._exits = true;
			return x;
		});
	}
	set_client_as_pending() {
		this.inputStore.update((x) => {
			x.client._exits = 'PENDING';
			x.client.first_name = '';
			x.client.last_name = '';
			x.client.email = '';
			return x;
		});
	}
}

function create_state_sell() {
	const input = new InputState();
	const sell_list = new SellState();

	const dialog_open = writable(false);

	async function search_product({ on_not_found }: { on_not_found: () => unknown }) {
		const { bar_code, amount } = input.getCurrent();

		const product = await fetch_product_by_bar_code(bar_code);
		if (!product) {
			return on_not_found();
		}
		sell_list.add(product, amount);
		input.reset();
	}

	async function submit_sell(calls: { on_success: () => unknown; on_error: () => unknown }) {
		const { client } = input.getCurrent();
		const { ok } = await fetch_submit_sell({
			products: sell_list.getProducts(),
			client
		});
		if (ok) {
			sell_list.reset();
			input.reset();
			calls.on_success();
		} else {
			calls.on_error();
		}
	}

	async function search_client(calls: {
		on_found: () => unknown;
		on_not_found: () => unknown;
		on_error: () => unknown;
	}) {
		const { dni } = input.getCurrent().client;
		const { exists } = await fetch_if_exits_with_dni(dni);
		if (exists) {
			calls.on_found();
			input.set_client_as_existing();
			dialog_open.set(false);
		} else {
			input.set_client_as_not_existing();
			calls.on_not_found();
		}
	}

	function create_client(calls: { on_success: () => unknown; on_error: () => unknown }) {
		dialog_open.set(false);
		calls.on_success();
		return { ok: true };
	}

	function remove_product_from_sell(id: number) {
		sell_list.remove_product_from_sell(id);
	}

	return {
		input: input.getStore(),
		sell_list: derived(sell_list.getListStore(), (x) => Array.from(x.values())),
		total: sell_list.totalStore(),
		search_product,
		submit_sell,
		search_client,
		create_client,
		remove_product_from_sell,
		dialog_open
	};
}

//
// Public API
//

const g_key = 'sell_state';

export function create_global_state_sell() {
	return setContext(g_key, create_state_sell());
}

export function get_global_state_sell() {
	return getContext<ReturnType<typeof create_global_state_sell>>(g_key);
}
