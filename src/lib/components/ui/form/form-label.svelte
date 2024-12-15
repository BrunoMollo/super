<script lang="ts">
	import type { WithoutChild } from 'bits-ui';
	import * as FormPrimitive from 'formsnap';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn } from '$lib/utils.js';

	let {
		children,
		class: className,
    props,
	}: WithoutChild<FormPrimitive.LabelProps> & {props:unknown}= $props();
</script>


{#if props instanceof Object}
		<Label {...props} class={cn('data-[fs-error]:text-destructive', className)}>
			{@render children?.()}
		</Label>
{:else}
    INVALID PROPS
{/if}
