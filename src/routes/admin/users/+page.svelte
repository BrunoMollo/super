<script>
	import UsersTable from './users-table.svelte';
	export let data;
</script>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Admin Users</h1>
<br />
<UsersTable users={data.users}></UsersTable>
