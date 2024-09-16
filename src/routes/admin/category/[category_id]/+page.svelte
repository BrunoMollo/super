<script lang="ts">
	import EditCategoryForm from './edit-category-form.svelte';
	export let data;
	const { form } = data;
</script>

<slot name="header" category={data.form.data}>
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Edit : {data.form.data.name} )
	</h2>
</slot>
<EditCategoryForm form_data={form} on:success={() => history.back()} />
