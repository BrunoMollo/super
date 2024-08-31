<script lang="ts">
	import type { LayoutRouteId } from '../$types';

	import { page } from '$app/stores';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { pushState } from '$app/navigation';
	import EditUserPage from './[user_id]/+page.svelte';
	import type { PageData } from './[user_id]/$types';
	import { shallow_navigate } from '$lib/utils/shallow-routing';

	export let id: number;
	const base_url = '/admin/users' satisfies LayoutRouteId;

	const href = [base_url, id].join('/');

	$: open = $page.state.edit_user_state ? true : false;

	const goto_profile = shallow_navigate<PageData>({
		on_load: (data) => {
			const edit_user_state = data;
			pushState(href, { edit_user_state });
		},
		on_redirect: () => {
			pushState(href, { edit_user_state: undefined });
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
	<a class={buttonVariants({ variant: 'outline' })} {href} on:click={goto_profile}>Edit Profile</a>
	<Dialog.Content class="sm:max-w-[425px]">
		{#if $page.state.edit_user_state}
			<EditUserPage data={$page.state.edit_user_state} />
		{/if}
	</Dialog.Content>
</Dialog.Root>
