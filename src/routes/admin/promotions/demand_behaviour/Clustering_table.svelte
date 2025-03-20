<script lang="ts">
	export let clustering_data: any;
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
</script>

<Table.Root>
	<Table.Header>
		<Table.Row>
			<Table.Head>Num. Grupo</Table.Head>
			{#each Object.keys(clustering_data[0]) as key}
				<Table.Head class="w-auto">{key}</Table.Head>
			{/each}
		</Table.Row>
	</Table.Header>
	<Table.Body>
		{#each clustering_data as arr_entry, i}
			<Table.Row>
				<Table.Cell class="w-[120px]">Grupo {i + 1}</Table.Cell>
				{#each Object.values(arr_entry) as row}
					<Table.Cell>{row}</Table.Cell>
				{/each}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>
