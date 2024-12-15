<script lang="ts">
	import { writable } from 'svelte/store';
	import { fetch_product_by_bar_code } from './api/product/product.client';

	let bar_code = '';
	let amount = 1;
	const sell_list = writable([] as { id: number; desc: string; amount: number }[]);

	async function search_product() {
		const product = await fetch_product_by_bar_code(bar_code);
		if (product) {
			sell_list.update((x) => [...x, { ...product, amount }]);
			bar_code = '';
			amount = 1;
		}
	}
</script>

<input type="text" placeholder="codigo de barras" bind:value={bar_code} />
<input type="text" placeholder="cantidad" />
<button on:click={search_product}> fetch </button>

<pre>
  {JSON.stringify($sell_list, null, 2)}
</pre>
