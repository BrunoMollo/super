<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { create_user_validator, type Create_user_dto } from '$lib/entities/user';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { LayoutRouteId } from '../../../$types';

	export let data: SuperValidated<Create_user_dto>;
	export let back: LayoutRouteId;

	const form = superForm(data, {
		validators: zodClient(create_user_validator)
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
		<Button class="w-4/12" variant="secondary" href={back}>Back</Button>
		<Form.Button class="w-6/12 ">Submit</Form.Button>
	</div>
</form>
