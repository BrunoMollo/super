<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { LayoutRouteId } from '../$types';

	export let id: number;
	const base_url = '/admin/users' satisfies LayoutRouteId;

	const href = [base_url, id].join('/');
</script>

<Button {href}>Details</Button>
