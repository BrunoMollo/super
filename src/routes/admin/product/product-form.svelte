<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { createEventDispatcher } from 'svelte';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte';
	import { fly } from 'svelte/transition';
	import {
		create_product_validator,
		type Product_Create_Dto,
		type Product_Update_Dto
	} from './validators';

	export let data: SuperValidated<Product_Create_Dto | Product_Update_Dto>;
	let error_message = '';

	const dispatch = createEventDispatcher();
	const form = superForm(data, {
		validators: zodClient(create_product_validator),
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

	//@ts-ignore
	const id: number | undefined = $formData.id;
</script>

<form method="POST" use:enhance class="flex flex-col gap-4">
	<input type="hidden" name="id" value={id} />
	<Form.Field {form} name="desc">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Description</Form.Label>
			<Input {...attrs} bind:value={$formData.desc} class="w-64" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="order_point">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Order Point</Form.Label>
			<Input {...attrs} bind:value={$formData.order_point} class="w-64" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div class="mt-4 flex w-64 justify-end gap-3">
		<Form.Button class="w-6/12 ">Submit</Form.Button>
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
