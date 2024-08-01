<script>
	import LoginForm from './login-form.svelte';

	export let data;
</script>

<main class="container flex flex-col">
	<h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">Login</h1>
	<LoginForm data={data.form}></LoginForm>
</main>
