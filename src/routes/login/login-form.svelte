<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { login_validator, type Login_dto } from '$lib/entities/user';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data: SuperValidated<Login_dto>;

	const form = superForm(data, {
		validators: zodClient(login_validator),

		onError: ({ result }) => {
			alert(result.error.message);
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="flex flex-col gap-4">
	<Form.Field {form} name="username">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Username</Form.Label>
			<Input {...attrs} bind:value={$formData.username} class="w-64" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Password</Form.Label>
			<Input {...attrs} bind:value={$formData.password} class="w-64" />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>

	<div class="mt-4 flex w-64 justify-end gap-3">
		<Form.Button class="w-6/12 ">Submit</Form.Button>
	</div>
</form>
