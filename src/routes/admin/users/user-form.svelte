<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { create_user_validator, type Create_user_dto } from './user-validator';
	import { createEventDispatcher } from 'svelte';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte';
	import { fly } from 'svelte/transition';
	import { roles } from '$lib/user';
	import { translateRole } from './utils';

	export let data: SuperValidated<Create_user_dto>;
	let error_message = '';

	const dispatch = createEventDispatcher();
	const form = superForm(data, {
		validators: zodClient(create_user_validator),
		onUpdate: (res) => {
			if (res.result.type == 'success') {
				dispatch('success', {
					ok: true
				});
			}
		},
		onError: ({ result }) => {
			error_message = result.error.message;
		}
	});

	const { form: formData, enhance } = form;

	function addItem(id: number) {
		$formData.roles_id = [...$formData.roles_id, id];
	}

	function removeItem(id: number) {
		$formData.roles_id = $formData.roles_id.filter((i) => i !== id);
	}
</script>

<form method="POST" use:enhance class="flex flex-col gap-4">
	<Form.Field {form} name="username">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Usuario</Form.Label>
			<Input {...attrs} bind:value={$formData.username} class="w-64" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Contraseña</Form.Label>
			<Input {...attrs} bind:value={$formData.password} class="w-64" />
			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>

	<Form.Fieldset {form} name="roles_id" class="space-y-0">
		<div class="mb-4">
			<Form.Legend class="text-base">Roles</Form.Legend>
			<Form.Description class="pb-2">Definir Roles</Form.Description>
			<Form.Field {form} name="roles_id">
				{#each roles as role}
					{@const checked = $formData.roles_id.includes(role.id)}
					<div class="flex flex-row items-start space-x-3">
						<Form.Control let:attrs>
							<Checkbox
								{...attrs}
								{checked}
								onCheckedChange={(v) => {
									if (v) {
										addItem(role.id);
									} else {
										removeItem(role.id);
									}
								}}
							/>
							<Form.Label class="text-sm font-normal">
								{translateRole(role.name)}
							</Form.Label>
							<input hidden type="checkbox" name={attrs.name} value={role.id} {checked} />
						</Form.Control>
					</div>
				{/each}
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</Form.Fieldset>

	<div class="mt-4 flex w-64 justify-end gap-3">
		<Form.Button class="w-6/12 ">Confirmar</Form.Button>
	</div>
</form>

{#if error_message}
	<div class="mt-4" transition:fly={{ x: 20 }}>
		<Alert.Root variant="destructive">
			<ExclamationTriangle class="h-4 w-4" />
			<Alert.Title>Error</Alert.Title>
			<Alert.Description>{error_message}</Alert.Description>
		</Alert.Root>
	</div>
{/if}
