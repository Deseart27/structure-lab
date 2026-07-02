<script lang="ts">
	import { page } from '$app/stores';
	let { children } = $props();
	let version = $derived($page.params.version);
</script>

{#if version === 'v6'}
	<section class="page m-2 flex rounded-3xl">
		<main class="flex w-full flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white" style="height: calc(100vh - 72px - 40px - 16px);">
			{@render children()}
		</main>
	</section>
{:else}
	{@render children()}
{/if}

<style>
	.page {
		box-shadow: 0px -4px 32px -4px rgba(3, 7, 18, 0.05);
	}
</style>
