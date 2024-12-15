<script lang="ts">
	import { readable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import Actions from './product-table-actions.svelte';
	import { fade } from 'svelte/transition';

	interface Props {
		products: Array<{
		id: number;
		desc: string;
		bar_code: number;
		order_point: number | null;
		categories: Array<{ id: number; name: string }>;
	}>;
	}

	let { products }: Props = $props();

	const table = createTable(readable(products));

	const columns = table.createColumns([
		table.column({
			accessor: 'desc',
			header: 'Descripcion'
		}),
		table.column({
			accessor: 'bar_code',
			header: 'Bar Code'
		}),
		table.column({
			accessor: 'order_point',
			header: 'Order Point'
		}),
		table.column({
			accessor: 'categories',
			header: 'Categories',
			cell: ({ value }) => value.map(({ name }) => name).join(', ')
		}),
		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => {
				return createRender(Actions, { id: value });
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = table.createViewModel(columns);
</script>

<div class="rounded-md border" transition:fade>
	<Table.Root {...$tableAttrs}>
		<Table.Header>
			{#each $headerRows as headerRow}
				<Subscribe rowAttrs={headerRow.attrs()}>
					<Table.Row>
						{#each headerRow.cells as cell (cell.id)}
							<Subscribe attrs={cell.attrs()}  props={cell.props()}>
								{#snippet children({ attrs })}
																<Table.Head {...attrs}>
										<Render of={cell.render()} />
									</Table.Head>
																							{/snippet}
														</Subscribe>
						{/each}
					</Table.Row>
				</Subscribe>
			{/each}
		</Table.Header>
		<Table.Body {...$tableBodyAttrs}>
			{#each $pageRows as row (row.id)}
				<Subscribe rowAttrs={row.attrs()} >
					{#snippet children({ rowAttrs })}
										<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} >
									{#snippet children({ attrs })}
																<Table.Cell {...attrs}>
											<Render of={cell.render()} />
										</Table.Cell>
																								{/snippet}
														</Subscribe>
							{/each}
						</Table.Row>
														{/snippet}
								</Subscribe>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
