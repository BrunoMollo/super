<script lang="ts">
	import EditCategoryForm from './edit-category-form.svelte';
	let { data, header } = $props();
	const { form } = data;
</script>

{#if header}{@render header({ category: data.form.data, })}{:else}
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Edit : {data.form.data.name} )
	</h2>
{/if}
<EditCategoryForm form_data={form} on:success={() => history.back()} />
