<script lang="ts">
	import EditUserForm from './edit-user-form.svelte';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	export let data;
</script>

<Dialog.Header>
	<Dialog.Title>Edit: {data.user.username} (id: {data.user.id})</Dialog.Title>
	<Dialog.Description>
		Make changes to your profile here. Click save when you're done.
	</Dialog.Description>
</Dialog.Header>
<EditUserForm data={data.form} />
