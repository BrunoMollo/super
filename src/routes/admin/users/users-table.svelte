<script lang="ts">
	import { readable } from 'svelte/store';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import * as Table from '$lib/components/ui/table';
	import type { Role } from '$lib/user';
	import UserTableAction from './user-table-action.svelte';
	import { toProperCase } from '$lib/utils';

	interface Props {
		users: Array<{
			id: number;
			username: string;
			roles: Role[];
		}>;
	}

	let { users }: Props = $props();

	const table = createTable(readable(users));

	const columns = table.createColumns([
		table.column({
			accessor: 'username',
			header: 'Username'
		}),
		table.column({
			accessor: 'roles',
			header: 'Roles',
			cell: (x) => x.value.map((x) => toProperCase(x.name)).join(', ')
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
							<Subscribe attrs={cell.attrs()} props={cell.props()}>
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
				<Subscribe rowAttrs={row.attrs()}>
					{#snippet children({ rowAttrs })}
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()}>
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
