<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { toProperCase } from '$lib/utils';

	export let options: { id: number; name: string }[];
	export let selected: number[];

	function addItem(id: number) {
		selected = [...selected, id];
	}

	function removeItem(id: number) {
		selected = selected.filter((i) => i !== id);
	}
</script>

{#each options as { id, name }}
	{@const checked = selected.includes(id)}
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
