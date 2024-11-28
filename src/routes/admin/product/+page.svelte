<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { toast } from 'svelte-sonner';
	import ProductTable from './product-table.svelte';
	import ProductForm from './product-form.svelte';

	export let data;

	let is_open = false;

	function on_product_added() {
		const description = new Date().toLocaleString();
		is_open = false;
		toast.success('Product has been created', {
			description
		});
	}
</script>

<main class="container pt-6">
	<div class="relative mb-6">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Admin Productos</h1>
		<div class="absolute right-4 top-1/4 flex justify-end">
			<Button on:click={() => (is_open = true)}>Add new Product</Button>
		</div>
	</div>
	<b class="text-4xl">
		{#await data.products then products}
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
			<ProductForm data={data.form} on:success={on_product_added} categories={data.categories} />
		</Sheet.Portal>
	</Sheet.Content>
</Sheet.Root>
