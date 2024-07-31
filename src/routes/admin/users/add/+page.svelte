<script lang="ts">
	import UserFrom from './user-from.svelte';

	export let data;
</script>

<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Add new User</h1>
<UserFrom data={data.form} back={'/admin/users'}></UserFrom>
