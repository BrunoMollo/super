<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { LayoutRouteId } from '../../$types';
	import UsersTable from './users-table.svelte';

	export let data;

	const create_url = '/admin/users/add' satisfies LayoutRouteId;
</script>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Admin Users</h1>
<div class="mt-4 flex flex-col gap-5">
	<div class="flex justify-end">
		<Button href={create_url}>Add new user</Button>
	</div>
	<UsersTable users={data.users}></UsersTable>
</div>
