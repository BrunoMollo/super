<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { toast } from 'svelte-sonner';
	import ProductTable from './product-table.svelte';
	import ProductForm from './product-form.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

	let { data } = $props();

	let is_open = $state(false);

	function on_product_added() {
		const description = new Date().toLocaleString();
		is_open = false;
		toast.success('Product has been created', {
			description
		});
	}

	// TODO: extract into component | fix flickering
	let catched_list: null | Awaited<typeof data.products> = $state(null);
	data.products.then((x) => (catched_list = x));
</script>

<main class="container pt-6">
	<div class="relative mb-6">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Admin Productos</h1>
		<div class="absolute right-4 top-1/4 flex justify-end">
			<Button on:click={() => (is_open = true)}>Add new Product</Button>
		</div>
	</div>
	<b class="text-4xl">
		{#await data.products}
			{#if catched_list}
				<ProductTable products={catched_list} />
			{:else}
				<div class="flex flex-col items-center space-y-2">
					{#each Array(15) as _}
						<Skeleton class="h-10 w-full" />
					{/each}
				</div>
			{/if}
		{:then products}
			<ProductTable {products} />
		{/await}
	</b>
</main>

<Sheet.Root bind:open={is_open}>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>New Product</Sheet.Title>
			<Sheet.Description>By compleating this from you'll create a new Product</Sheet.Description>
		</Sheet.Header>
		<Sheet.Portal>
			{#await data.categories}
				<div class="flex flex-col items-center space-y-4">
					{#each Array(5) as _}
						<Skeleton class="h-4 w-full" />
					{/each}
				</div>
			{:then categories}
				<ScrollArea class="h-[80vh]">
					<ProductForm data={data.form} on:success={on_product_added} {categories} />
				</ScrollArea>
			{/await}
		</Sheet.Portal>
	</Sheet.Content>
</Sheet.Root>
