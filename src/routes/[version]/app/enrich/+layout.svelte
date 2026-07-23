<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	let { children } = $props();
	let version = $derived($page.params.version);
	let base = $derived(`${svelteBase}/${version}`);
	let route = $derived($page.url.pathname);

	type SubItem = { label: string; href: string; match: string };
	const enrichSubItems: SubItem[] = [
		{ label: 'Emails & Phones', href: '/app/enrich', match: '/enrich' },
		{ label: 'Reverse Lookup', href: '/app/enrich/reverse', match: '/enrich/reverse' },
		{ label: 'CRM Enrichment', href: '/app/enrich/crm', match: '/enrich/crm' },
	];

	function isActive(item: SubItem): boolean {
		if (item.match === '/enrich') {
			return route.includes('/enrich') && !route.includes('/enrich/reverse') && !route.includes('/enrich/crm');
		}
		return route.includes(item.match);
	}
</script>

{#if version === 'v4'}
	<section class="page m-2 flex rounded-3xl">
		<main
			class="flex w-full flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white"
			style="height: calc(100vh - 72px - 16px);"
		>
			<!-- Pill tabs -->
			<div class="flex shrink-0 items-center gap-1 px-6 pt-5 pb-2">
				{#each enrichSubItems as item}
					<a
						class="pill flex h-8 items-center rounded-full px-3.5 text-sm font-medium transition-colors"
						class:active={isActive(item)}
						class:text-grey-600={!isActive(item)}
						href="{base}{item.href}"
					>
						{item.label}
					</a>
				{/each}
			</div>
			<div class="min-h-0 flex-1 overflow-hidden">
				{@render children()}
			</div>
		</main>
	</section>
{:else if version === 'v9'}
	<section class="page m-2 flex rounded-3xl">
		<main
			class="flex w-full overflow-hidden rounded-2xl border border-grey-200 bg-white"
			style="height: calc(100vh - 72px - 16px);"
		>
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

	.pill.active {
		background-color: var(--Violet-50, #f5f2ff);
		color: var(--Violet-800, #4b25bb);
		font-weight: 600;
	}

	.pill:not(.active):hover {
		background-color: var(--Grey-50, #f9f8fa);
		color: var(--Grey-900, #18151e);
	}
</style>
