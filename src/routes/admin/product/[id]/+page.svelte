<script lang="ts">
	import ProductForm from '../product-form.svelte';

	let { data } = $props();
</script>

<main class="flex flex-col justify-center gap-4 p-4 pl-6 pt-10 align-middle">
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Edit Product {data.product.id}
	</h2>

	<ProductForm data={data.form} categories={data.categories} />
</main>
