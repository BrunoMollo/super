<script lang="ts">
	import { onMount } from 'svelte';
	import * as Table from '$lib/components/ui/table';
	import { Ellipsis, Info } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';

	let least_sold_data: [] = [];
	onMount(async () => {
		const response = await fetch('./api/least_sold');
		least_sold_data = await response.json();
		console.log(least_sold_data);
	});
</script>

<div class="flex-1 space-y-4 p-8 pt-6">
	<h1 class="text-3xl font-bold tracking-tight">Productos menos vendidos</h1>

	{#if least_sold_data.length === 0}
		<p>No hay productos que no se hayan vendido en mucho tiempo.</p>
	{/if}
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Producto</Table.Head>
				<Table.Head>Precio actual</Table.Head>
				<Table.Head>Unidades vendidas</Table.Head>
				<Table.Head>Fecha de la última venta</Table.Head>
				<Table.Head></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each least_sold_data as product}
				<Table.Row>
					<Table.Cell>{product.name}</Table.Cell>
					<Table.Cell class="w-[150px]">${product.price}</Table.Cell>
					<Table.Cell class="w-[150px]">{product.quantity}</Table.Cell>
					<Table.Cell class="w-[200px]"
						>{new Date(product.last_sale).toLocaleDateString()}</Table.Cell
					>
					<Table.Cell class="w-[100px] p-0">
						<Button variant="outline" href="../product/{product.id}">Editar producto</Button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
		<Table.Caption>
			Nota: Productos que no se hayan vendido en mucho tiempo generarán perdidas si expiran. Sería
			conveniente realizar descuentos o promociones con ellos para minimizar la perdida.
		</Table.Caption>
	</Table.Root>
</div>
