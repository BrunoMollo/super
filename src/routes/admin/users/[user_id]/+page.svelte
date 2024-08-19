<script lang="ts">
	import EditUserForm from './edit-user-form.svelte';
	export let data;
</script>

<h2
	class="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
>
	{data.user.id}: {data.user.username}
</h2>

<EditUserForm data={data.form} />
