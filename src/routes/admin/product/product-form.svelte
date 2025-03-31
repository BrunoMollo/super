<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
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
	import { toProperCase } from '$lib/utils';

	export let data: SuperValidated<Product_Create_Dto | Product_Update_Dto>;
	export let categories: Array<{ id: number; name: string }>;
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

	//@ts-expect-error dam
	const id: number | undefined = $formData.id;

	function addItem(id: number) {
		$formData.categories_ids = [...$formData.categories_ids, id];
	}

	function removeItem(id: number) {
		$formData.categories_ids = $formData.categories_ids.filter((i) => i !== id);
	}
</script>

<form method="POST" use:enhance class="flex flex-col gap-4">
	<input type="hidden" name="id" value={id} />
	<Form.Field {form} name="desc">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Descripción</Form.Label>
			<Input {...attrs} bind:value={$formData.desc} class="w-64" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="bar_code">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Código de barras</Form.Label>
			<Input {...attrs} bind:value={$formData.bar_code} class="w-64" maxlength={12} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="price">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Precio</Form.Label>
			<Input {...attrs} bind:value={$formData.price} class="w-64" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="iva_percentage">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Iva (%)</Form.Label>
			<Input {...attrs} bind:value={$formData.iva_percentage} class="w-64" max="100" step="0.01" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="order_point">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Punto de pedido</Form.Label>
			<Input {...attrs} bind:value={$formData.order_point} class="w-64" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Fieldset {form} name="categories_ids" class="space-y-0">
		<div class="mb-4">
			<Form.Legend class="text-base">Categorias</Form.Legend>
			<Form.Description class="pb-2">Definir categorias</Form.Description>
			<Form.Field {form} name="categories_ids">
				{#each categories as { id, name }}
					{@const checked = $formData.categories_ids.includes(id)}
					<div class="flex flex-row items-start space-x-3">
						<Form.Control let:attrs>
							<Checkbox
								{...attrs}
								{checked}
								onCheckedChange={(v) => {
									if (v) {
										addItem(id);
									} else {
										removeItem(id);
									}
								}}
							/>
							<Form.Label class="text-sm font-normal">
								{toProperCase(name)}
							</Form.Label>
							<input hidden type="checkbox" name={attrs.name} value={id} {checked} />
						</Form.Control>
					</div>
				{/each}
				<Form.FieldErrors />
			</Form.Field>
		</div>
	</Form.Fieldset>

	<div class="mt-4 flex w-64 justify-end gap-3">
		<Form.Button class="w-6/12 ">Guardar</Form.Button>
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
