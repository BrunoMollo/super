<script>
	import LoginForm from './login-form.svelte';
	import * as Card from '$lib/components/ui/card/index';

	export let data;
</script>

<main class="flex h-screen w-screen flex-col items-center justify-center align-middle">
	<Card.Root class="w-[350px]">
		<Card.Header>
			<Card.Title class="text-3xl">Login</Card.Title>
			<Card.Description>Bienvenido a la aplicación</Card.Description>
		</Card.Header>
		<Card.Content>
			<LoginForm data={data.form}></LoginForm>
		</Card.Content>
	</Card.Root>
</main>

<style lang="postcss">
	main {
		@apply bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500;
	}
</style>
