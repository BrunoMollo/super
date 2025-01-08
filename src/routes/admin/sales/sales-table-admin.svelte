<script lang="ts">
	import { readable } from 'svelte/store';
	import { createTable, Render, Subscribe } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import type { Sale } from '$lib/repos/sale-repo';

	export let sales: Array<Sale>;

	const table = createTable(readable(sales));

	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: 'Numero de venta'
		}),
		table.column({
			accessor: 'lines',
			header: 'Total',
			cell: (x) => {
				const total = x.value
					.reduce((acc, line) => acc + Number(line.unit_price) * line.quantity, 0)
					.toFixed(2);
				return `$ ${total}`;
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border">
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
								<Table.Head {...attrs}>
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
								<Table.Cell {...attrs}>
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
