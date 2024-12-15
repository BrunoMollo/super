<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Sheet from '$lib/components/ui/sheet';
	import { toast } from 'svelte-sonner';
	import CategoryForm from './category-form.svelte';
	import CategoryTable from './category-table.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	let { data } = $props();

	let is_open = $state(false);

	function on_category_added() {
		const description = new Date().toLocaleString();
		is_open = false;
		toast.success('Category has been created', {
			description
		});
	}
</script>

<main class="container pt-6">
	<div class="relative mb-6">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Admin Category</h1>
		<div class="absolute right-4 top-1/4 flex justify-end">
			<Button
				onclick={() => {
					is_open = true;
				}}>Add new Category</Button
			>
		</div>
	</div>

	{#await data.categories}
		<div class="flex flex-col items-center space-y-2">
			{#each Array(15) as _}
				<Skeleton class="h-10 w-full" />
			{/each}
		</div>
	{:then categories}
		<CategoryTable {categories} />
	{/await}
</main>

<Sheet.Root bind:open={is_open}>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>New Category</Sheet.Title>
			<Sheet.Description>By compleating this from you'll create a new Category</Sheet.Description>
		</Sheet.Header>
		<CategoryForm data={data.form} on:success={on_category_added} />
	</Sheet.Content>
</Sheet.Root>
