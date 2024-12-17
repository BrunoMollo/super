<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { createEventDispatcher } from 'svelte';
	import { Input } from '$lib/components/ui/input';
	import { type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { invalidateAll } from '$app/navigation';
	import { edit_category_validator, type Edit_Cateogory_Dto } from '../category-validators';

	export let form_data: SuperValidated<Edit_Cateogory_Dto>;

	const dispatch = createEventDispatcher();
	const super_form = superForm(form_data.data, {
		validators: zodClient(edit_category_validator),
		onUpdate: async (res) => {
			if (res.result.type == 'success') {
				await invalidateAll();
				toast.success('Categoria fue editada');
				dispatch('success', {
					ok: true
				});
			}
		},
		onError: ({ result }) => {
			alert(result.error.message);
		}
	});

	$: changed = false;

	const { form, enhance } = super_form;
</script>

<form method="POST" use:enhance class="flex max-w-sm flex-col gap-4">
	<input type="hidden" name="id" value={$form.id} />
	<Form.Field form={super_form} name="name">
		<Form.Control let:attrs>
			<Form.Label class="text-lg">Nombre</Form.Label>
			<Input {...attrs} bind:value={$form.name} class="w-64" />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>
	<div class="mt-4 flex justify-end gap-3">
		<Form.Button class="w-6/12 " disabled={changed}>Guardar Cambios</Form.Button>
	</div>
</form>
