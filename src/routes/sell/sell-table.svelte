<script lang="ts">
	import { readable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import SellTableActions from './sell-table-actions.svelte';

	export let lines: Array<{
		id: number;
		desc: string;
		amount: number;
		price: number;
	}>;

	const table = createTable(readable(lines));

	const columns = table.createColumns([
		table.column({
			accessor: 'desc',
			header: 'Producto'
		}),
		table.column({
			accessor: 'amount',
			header: 'Cantidad'
		}),
		table.column({
			accessor: 'price',
			header: 'Precio',
			cell: ({ value }) => `$${value.toFixed(2)}`
		}),
		table.column({
			accessor: 'id',
			header: 'Acumulado',
			cell: ({ value }) => {
				const acum = lines
					.filter((x) => x.id == value)
					.reduce((acum, prod) => acum + prod.price * prod.amount, 0);
				return '$' + acum.toFixed(2);
			}
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				return createRender(SellTableActions, {
					product_id: value
				});
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="w-[600px] rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs} class="my-0 h-4 py-2">
									<Render of={cell.render()} />
								</Table.Head>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
					<Table.Row {...rowAttrs}>
						{#each row.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs>
								<Table.Cell {...attrs} class="my-0 h-2 py-2">
									<Render of={cell.render()} />
								</Table.Cell>
							</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
