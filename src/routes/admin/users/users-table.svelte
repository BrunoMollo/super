<script lang="ts">
	import { readable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import type { Role } from '$lib/user';
	import UserTableAction from './user-table-action.svelte';
	import { translateRole } from './utils';

	export let users: Array<{
		id: number;
		username: string;
		roles: Role[];
	}>;

	const table = createTable(readable(users));

	const columns = table.createColumns([
		table.column({
			accessor: 'username',
			header: 'Usuario'
		}),
		table.column({
			accessor: 'roles',
			header: 'Roles',
			cell: (x) => x.value.map((x) => translateRole(x.name)).join(', ')
		}),

		table.column({
			accessor: ({ id }) => id,
			header: '',
			cell: ({ value }) => createRender(UserTableAction, { id: value })
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
