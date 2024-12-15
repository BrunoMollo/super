<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';
	import UsersTable from './users-table.svelte';
	import UserForm from './user-form.svelte';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let is_open = $state(false);

	function on_user_added() {
		const description = new Date().toLocaleString();
		is_open = false;
		toast.success('User has been created', {
			description
		});
	}
</script>

<main class="container pt-6">
	<div class="relative mb-6">
		<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Admin Users</h1>
		<div class="absolute right-4 top-1/4 flex justify-end">
			<Button onclick={() => (is_open = true)}>Add new user</Button>
		</div>
	</div>
	{#key data.users}
		<UsersTable users={data.users}></UsersTable>
	{/key}
</main>

<Sheet.Root bind:open={is_open}>
	<Sheet.Content>
		<Sheet.Header>
			<Sheet.Title>New User</Sheet.Title>
			<Sheet.Description>By compleating this from you'll create a new User</Sheet.Description>
		</Sheet.Header>
		<UserForm data={data.form} on:success={on_user_added} />
	</Sheet.Content>
</Sheet.Root>
