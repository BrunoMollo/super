<script lang="ts">
	import type { LayoutRouteId } from '../$types';

	import { page } from '$app/stores';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { preloadData, pushState, goto } from '$app/navigation';
	import EditUserPage from './[user_id]/+page.svelte';
	import type { PageData } from './[user_id]/$types';

	export let id: number;
	const base_url = '/admin/users' satisfies LayoutRouteId;

	const href = [base_url, id].join('/');

	$: open = $page.state.edit_user_state ? true : false;

	async function goto_profile(e: MouseEvent & { currentTarget: HTMLAnchorElement }) {
		if (
			innerWidth < 640 || // bail if the screen is too small
			e.shiftKey || // or the link is opened in a new window
			e.metaKey ||
			e.ctrlKey // or a new tab (mac: metaKey, win/linux: ctrlKey)
			// should also consider clicking with a mouse scroll wheel
		)
			return;

		// prevent navigation
		e.preventDefault();

		const { href } = e.currentTarget;

		// run `load` functions (or rather, get the result of the `load` functions
		// that are already running because of `data-sveltekit-preload-data`)
		const result = await preloadData(href);

		if (result.type === 'loaded' && result.status === 200) {
			const edit_user_state = result.data as PageData;
			pushState(href, { edit_user_state });
		} else {
			// something bad happened! try navigating
			goto(href);
		}
	}
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
