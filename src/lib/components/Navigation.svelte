<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';

	let route = $derived($page.url.pathname);
	let base = $derived(`${svelteBase}/${$page.params.version}`);
	let version = $derived($page.params.version);

	type NavItem = { label: string; href: string; match: string; badge?: string };

	let navItems = $derived<NavItem[]>(
		version === 'v6'
			? [
					{ label: 'Search', href: `${base}/app/search`, match: '/search' },
					{ label: 'Enrichment', href: `${base}/app/enrich`, match: '/enrich' },
					{ label: 'Lists', href: `${base}/app/prospects`, match: '/prospects' },
					{ label: 'Integrations', href: `${base}/app/integrations`, match: '/integrations' },
				]
			: version === 'v4'
			? [
					{ label: 'Search', href: `${base}/app/search`, match: '/search' },
					{ label: 'Enrichment', href: `${base}/app/enrich`, match: '/enrich' },
					{ label: 'Lists', href: `${base}/app/prospects`, match: '/prospects' },
					{ label: 'Integrations', href: `${base}/app/integrations`, match: '/integrations' },
				]
			: version === 'v3'
			? [
					{ label: 'Search', href: `${base}/app/search`, match: '/search' },
					{ label: 'Enrichment', href: `${base}/app/enrich`, match: '/enrich' },
					{ label: 'Lists', href: `${base}/app/prospects/lists`, match: '/prospects' },
					{ label: 'Integrations', href: `${base}/app/integrations`, match: '/integrations' },
				]
			: version === 'v2'
			? [
					{ label: 'Search', href: `${base}/app/search`, match: '/search' },
					{ label: 'Enrichment', href: `${base}/app/enrich`, match: '/enrich' },
					{ label: 'Lists', href: `${base}/app/prospects`, match: '/prospects' },
					{ label: 'Integrations', href: `${base}/app/integrations`, match: '/integrations' },
				]
			: [
					{ label: 'Search', href: `${base}/app/search`, match: '/search' },
					{ label: 'Enrichment', href: `${base}/app/enrich`, match: '/enrich' },
					{ label: 'Reverse Email Lookup', href: `${base}/app/lookup`, match: '/lookup', badge: 'New' },
					{ label: 'API Console', href: `${base}/app/api`, match: '/api' },
					{ label: 'MCP & Integrations', href: `${base}/app/integrations`, match: '/integrations' },
				]
	);
</script>

<div class="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto lg:gap-6" style="scrollbar-width:none">
	{#each navItems as item}
		<div class="relative shrink-0">
			{#if route.includes(item.match)}
				<div class="absolute top-0 left-0 h-full w-full rounded-lg bg-violet-200"></div>
			{/if}
			<a
				class="text-grey-600 relative z-[2] flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap"
				class:text-violet-800={route.includes(item.match)}
				class:font-semibold={route.includes(item.match)}
				href={item.href}
			>
				{item.label}
				{#if item.badge}
					<div class="inline-flex items-center justify-center gap-1 rounded-full bg-[#EFEBFF] px-2 py-0.5 text-xs leading-tight font-medium text-violet-800 outline -outline-offset-1 outline-violet-300">
						{item.badge}
					</div>
				{/if}
			</a>
		</div>
	{/each}
</div>
