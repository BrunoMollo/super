<script lang="ts">
	import { create_state_sell } from './sell.state';

	const { input, sell_list, search_product } = create_state_sell();
</script>

<input type="text" placeholder="codigo de barras" bind:value={$input.bar_code} />
<input type="number" placeholder="cantidad" bind:value={$input.amount} />
<button on:click={search_product}> fetch </button>

<pre>
  {JSON.stringify($sell_list, null, 2)}
</pre>
