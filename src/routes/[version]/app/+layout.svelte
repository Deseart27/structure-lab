<script lang="ts">
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import SubNav from '$lib/components/SubNav.svelte';
	import Toast from '$lib/components/Toast.svelte';
	let { children } = $props();

	let version = $derived($page.params.version);
</script>

<div class="flex min-h-screen min-w-screen flex-col">
	<Navbar />
	{#if version === 'v2' || version === 'v3' || version === 'v6'}
		<SubNav />
	{/if}
	{@render children()}
</div>
<Toast />
