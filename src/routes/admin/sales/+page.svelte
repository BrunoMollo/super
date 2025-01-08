<script>
	import { Skeleton } from '$lib/components/ui/skeleton';
	import SalesTableAdmin from './sales-table-admin.svelte';

	export let data;
</script>

<main class="container pt-6">
	<div class="relative mb-6">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
			Historial de Ventas
		</h1>
	</div>

	{#await data.sales}
		<div class="flex flex-col items-center space-y-2">
			{#each Array(15) as _}
				<Skeleton class="h-10 w-full" />
			{/each}
		</div>
	{:then sales}
		<SalesTableAdmin {sales} />
	{/await}
</main>
