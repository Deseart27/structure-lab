<script lang="ts">
	import { page } from '$app/stores';
	let { children } = $props();
	let version = $derived($page.params.version);
</script>

{#if version === 'v4' || version === 'v6' || version === 'v7'}
	<section class="page m-2 flex rounded-3xl">
		<main
			class="flex w-full flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white"
			style="height: calc(100vh - 72px - 16px);"
		>
			{@render children()}
		</main>
	</section>
{:else}
	<div
		class="flex flex-col overflow-hidden"
		class:h-[calc(100vh-64px)]={version !== 'v2' && version !== 'v3' && version !== 'v6'}
		class:h-[calc(100vh-64px-40px)]={version === 'v2' || version === 'v3' || version === 'v6' || version === 'v7'}
	>
		{@render children()}
	</div>
{/if}

<style>
	.page {
		box-shadow: 0px -4px 32px -4px rgba(3, 7, 18, 0.05);
	}
</style>
