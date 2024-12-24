<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { createEventDispatcher } from 'svelte';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte';
	import { fly } from 'svelte/transition';
	import { create_category_validator, type Create_Category_Dto } from './category-validators';

	export let data: SuperValidated<Create_Category_Dto>;
	let error_message = '';

	const dispatch = createEventDispatcher();
	const form = superForm(data, {
		validators: zodClient(create_category_validator),
		onUpdate: (res) => {
			if (res.result.type == 'success') {
				dispatch('success', {
					ok: true
				});
			}
		},

		onError: (res) => {
			error_message = res.result.error.message;
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="flex flex-col gap-4">
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Nombre</Form.Label>
			<Input {...attrs} bind:value={$formData.name} class="w-64" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div class="mt-4 flex w-64 justify-end gap-3">
		<Form.Button class="w-6/12 ">Crear Categoria</Form.Button>
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
