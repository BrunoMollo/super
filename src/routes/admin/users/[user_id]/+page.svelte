<script lang="ts">
	import EditUserForm from './edit-user-form.svelte';

	let { data, header } = $props();
</script>

{#if header}{@render header({ user: data.user, })}{:else}
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Edit : {data.user.username} (id: {data.user.id})
	</h2>
{/if}
<EditUserForm data={data.form} />
