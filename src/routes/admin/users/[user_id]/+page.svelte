<script lang="ts">
	import EditUserForm from './edit-user-form.svelte';

	export let data;
</script>

<slot name="header" user={data.user}>
	<h2
		class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
	>
		Editar: {data.user.username}
	</h2>
</slot>
<EditUserForm data={data.form} />
