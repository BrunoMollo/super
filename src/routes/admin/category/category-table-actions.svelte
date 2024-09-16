<script lang="ts">
	import type { LayoutRouteId } from '../$types';

	import { page } from '$app/stores';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { pushState } from '$app/navigation';
	import type { PageData } from './[category_id]/$types';
	import EditCategoryPage from './[category_id]/+page.svelte';
	import { shallow_navigate } from '$lib/utils/shallow-routing';

	export let id: number;
	const base_url = '/admin/category' satisfies LayoutRouteId;

	const href = [base_url, id].join('/');

	$: open = $page.state.edit_category_state ? true : false;

	const goto_category = shallow_navigate<PageData>({
		on_load: (data) => {
			const edit_category_state = data;
			pushState(href, { edit_category_state });
		},
		on_redirect: () => {
			pushState(href, { edit_category_state: undefined });
		}
	});
</script>

<Dialog.Root
	bind:open
	onOpenChange={(open) => {
		if (!open) {
			history.back();
		}
	}}
>
	<a class={buttonVariants({ variant: 'outline' })} {href} on:click={goto_category}>Edit Category</a
	>
	<Dialog.Content class="sm:max-w-[425px]">
		{#if $page.state.edit_category_state}
			<EditCategoryPage data={$page.state.edit_category_state}>
				<Dialog.Header slot="header">
					<Dialog.Title>EDIT</Dialog.Title>
					<Dialog.Description>
						Make changes to your profile here. Click save when you're done.
					</Dialog.Description>
				</Dialog.Header>
			</EditCategoryPage>
		{/if}
	</Dialog.Content>
</Dialog.Root>
