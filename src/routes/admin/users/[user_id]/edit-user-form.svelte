<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { roles, type Edit_User_Dto, edit_user_validator } from '$lib/entities/user';
	import { createEventDispatcher } from 'svelte';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toProperCase } from '$lib/utils';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import ExclamationTriangle from 'svelte-radix/ExclamationTriangle.svelte';
	import { fly } from 'svelte/transition';

	export let data: SuperValidated<Edit_User_Dto>;
	let error_message = '';

	const dispatch = createEventDispatcher();
	const form = superForm(data, {
		validators: zodClient(edit_user_validator),
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
	<input type="hidden" value={$formData.user_id} name="user_id" />
	<Form.Fieldset {form} name="roles_id" class="space-y-0">
		<div class="mb-4">
			<Form.Legend class="scroll-m-20 text-xl font-semibold tracking-tight">Roles</Form.Legend>
			<Form.Description class="pb-2">Define permisions</Form.Description>
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
								{toProperCase(role.name)}
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
