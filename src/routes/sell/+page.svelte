<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import SellTable from './sell-table.svelte';
	import { create_state_sell } from './sell.state';

	const { input, sell_list, total, search_product } = create_state_sell();
	function on_not_found() {
		alert('Producto no encontrado');
	}
</script>

<main class="container">
	<h1
		class="scroll-m-20 pb-2 pl-4 pt-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Punto de Venta
	</h1>
	<div class="flex flex-row gap-2 pt-4">
		<div class="pl-4">
			<Label class="pl-1">Código de Barras</Label>
			<Input class="w-40" type="text" placeholder="codigo de barras" bind:value={$input.bar_code} />
		</div>
		<div>
			<Label class="pl-1">Cantidad</Label>
			<Input class="w-20" type="number" placeholder="cantidad" bind:value={$input.amount} />
		</div>
		<div class="relative w-48">
			<Button class="absolute bottom-0" on:click={() => search_product({ on_not_found })}>
				Agregar
			</Button>

			<span class="absolute bottom-0 right-0 w-20 text-2xl">Total: ${$total.toFixed(2)}</span>
		</div>
	</div>

	<div class="flex flex-col gap-4 pl-4 pt-4">
		{#key $sell_list}
			<SellTable lines={$sell_list} />
		{/key}
	</div>
</main>
