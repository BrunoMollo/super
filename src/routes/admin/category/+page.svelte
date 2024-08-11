<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import CategoryTable from './category-table.svelte';
	export let data;
</script>

<main class="container pt-6">
	<div class="relative mb-6">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Admin Category</h1>
		<div class="absolute right-4 top-1/4 flex justify-end">
			<Button>Add new Category</Button>
		</div>
	</div>

	{#key data.categories}
		<CategoryTable categories={data.categories} />
	{/key}
</main>
