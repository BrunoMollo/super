<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { LayoutRouteId } from '../$types';
	import { page } from '$app/stores';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { pushState } from '$app/navigation';
	import EditUserPage from './[user_id]/+page.svelte';
	import type { PageData } from './[user_id]/$types';
	import { shallow_navigate } from '$lib/utils/shallow-routing';

	interface Props {
		id: number;
	}

	let { id }: Props = $props();
	const base_url = '/admin/users' satisfies LayoutRouteId;

	const href = [base_url, id].join('/');

	let open;
	run(() => {
		open = $page.state.edit_user_state ? true : false;
	});

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
	<a class={buttonVariants({ variant: 'outline' })} {href} onclick={goto_profile}>Edit Profile</a>
	<Dialog.Content class="sm:max-w-[425px]">
		{#if $page.state.edit_user_state}
			<EditUserPage data={$page.state.edit_user_state}>
				{#snippet header()}
					<Dialog.Header>
						<Dialog.Title>EDIT</Dialog.Title>
						<Dialog.Description>
							Make changes to your profile here. Click save when you're done.
						</Dialog.Description>
					</Dialog.Header>
				{/snippet}
			</EditUserPage>
		{/if}
	</Dialog.Content>
</Dialog.Root>
