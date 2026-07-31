<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';

	let route = $derived($page.url.pathname);
	let fullUrl = $derived($page.url.pathname + $page.url.search);
	let base = $derived(`${svelteBase}/${$page.params.version}`);
	let version = $derived($page.params.version);



	type NavItem = { label: string; href: string; match: string; matchExclude?: string; matchQuery?: string; badge?: string };

	function isNavActive(item: NavItem): boolean {
		if (item.matchExclude && route.includes(item.matchExclude)) return false;
		if (item.matchQuery) return fullUrl.includes(item.matchQuery);
		// For V11 Enrichments: don't highlight when on Contacts view or list detail
		if (version === 'v11' && item.label === 'Enrichments' && (fullUrl.includes('view=contacts') || /\/prospects\/[^/]/.test(route))) return false;
		// For V11 Lists: also active on list detail pages
		if (version === 'v11' && item.label === 'Lists' && /\/prospects\/[^c]/.test(route)) return true;
		return route.includes(item.match);
	}

	let navItems = $derived<NavItem[]>(
		version === 'v11'
			? [
					{ label: 'Search', href: `${base}/app/search`, match: '/search' },
					{ label: 'Lists', href: `${base}/app/prospects?view=contacts`, match: '/prospects', matchQuery: 'view=contacts' },
					{ label: 'Enrichments', href: `${base}/app/prospects`, match: '/prospects', matchExclude: '/prospects/companies' },
					{ label: 'Integrations', href: `${base}/app/integrations`, match: '/integrations' },
				]
		: version === 'v10'
			? [
					{ label: 'Search', href: `${base}/app/search`, match: '/search' },
					{ label: 'Contacts', href: `${base}/app/prospects`, match: '/prospects', matchExclude: '/prospects/companies' },
					{ label: 'Companies', href: `${base}/app/prospects/companies`, match: '/prospects/companies' },
					{ label: 'Integrations', href: `${base}/app/integrations`, match: '/integrations' },
				]
			: version === 'v9'
			? [
					{ label: 'Search', href: `${base}/app/search`, match: '/search' },
					{ label: 'Contacts', href: `${base}/app/prospects`, match: '/prospects' },
					{ label: 'Enrichment', href: `${base}/app/enrich`, match: '/enrich' },
					{ label: 'Integrations', href: `${base}/app/integrations`, match: '/integrations' },
				]
			: version === 'v8'
			? [
					{ label: 'Search', href: `${base}/app/search`, match: '/search' },
					{ label: 'Lists', href: `${base}/app/prospects`, match: '/prospects' },
					{ label: 'Enrichment', href: `${base}/app/enrich`, match: '/enrich' },
					{ label: 'Integrations', href: `${base}/app/integrations`, match: '/integrations' },
				]
			: version === 'v7'
			? [
					{ label: 'Search', href: `${base}/app/search`, match: '/search' },
					{ label: 'Lists', href: `${base}/app/prospects`, match: '/prospects' },
					{ label: 'Enrichment', href: `${base}/app/enrich`, match: '/enrich' },
					{ label: 'Integrations', href: `${base}/app/integrations`, match: '/integrations' },
				]
			: version === 'v6'
			? [
					{ label: 'Search', href: `${base}/app/search`, match: '/search' },
					{ label: 'Lists', href: `${base}/app/prospects`, match: '/prospects' },
					{ label: 'Enrichment', href: `${base}/app/enrich`, match: '/enrich' },
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
			{#if isNavActive(item)}
				<div class="absolute top-0 left-0 h-full w-full rounded-lg bg-violet-200"></div>
			{/if}
			<a
				class="text-grey-600 relative z-[2] flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap"
				class:text-violet-800={isNavActive(item)}
				class:font-semibold={isNavActive(item)}
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

	{#if version === 'v10'}
		<a
			href="{base}/app/enrich"
			class="ml-1 flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-violet-700 px-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-800 hover:shadow-md"
		>
			<span class="material-icons-round text-base">add</span>
			New Enrichment
		</a>
	{/if}

	{#if version === 'v11'}
		<!-- placeholder: button rendered in Navbar to avoid overflow clipping -->
	{/if}
</div>
