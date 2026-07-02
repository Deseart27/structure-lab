<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';

	let route = $derived($page.url.pathname);
	let base = $derived(`${svelteBase}/${$page.params.version}`);
	let version = $derived($page.params.version);

	type SubItem = { label: string; href: string; match: string };

	type SectionConfig = {
		section: string;
		match: string;
		items: SubItem[];
	};

	const baseSections: SectionConfig[] = [
		{
			section: 'search',
			match: '/search',
			items: [
				{ label: 'People', href: '/app/search/people', match: '/search/people' },
				{ label: 'Companies', href: '/app/search/companies', match: '/search/companies' },
			],
		},
		{
			section: 'enrich',
			match: '/enrich',
			items: [
				{ label: 'Emails & Phones', href: '/app/enrich', match: '/enrich' },
				{ label: 'Reverse Lookup', href: '/app/enrich/reverse', match: '/enrich/reverse' },
				{ label: 'CRM Enrichment', href: '/app/enrich/crm', match: '/enrich/crm' },
			],
		},
	];

	const v6Sections: SectionConfig[] = [
		{
			section: 'search',
			match: '/search',
			items: [
				{ label: 'People', href: '/app/search/people', match: '/search/people' },
				{ label: 'Companies', href: '/app/search/companies', match: '/search/companies' },
			],
		},
		{
			section: 'integrations',
			match: '/integrations',
			items: [
				{ label: 'CRM', href: '/app/integrations', match: '/integrations' },
				{ label: 'Engagement', href: '/app/integrations/engagement', match: '/integrations/engagement' },
				{ label: 'API & MCP', href: '/app/integrations/api', match: '/integrations/api' },
			],
		},
	];

	// V3: same search sub-nav as v2, adds Lists sub-nav (Lists | All Contacts)
	let sections = $derived<SectionConfig[]>(
		version === 'v6'
			? v6Sections
			: version === 'v3'
			? [
					...baseSections,
					{
						section: 'lists',
						match: '/prospects',
						items: [
							{ label: 'Lists', href: '/app/prospects/lists', match: '/prospects/lists' },
							{ label: 'All Contacts', href: '/app/prospects', match: '/prospects' },
						],
					},
				]
			: baseSections // v2 and v4 use baseSections (search + enrich sub-navs only)
	);

	let activeSection = $derived(sections.find((s) => route.includes(s.match)));

	function isActive(item: SubItem): boolean {
		// For "Emails & Phones" (the default enrich), match exactly — not when on /enrich/reverse or /enrich/crm
		if (item.match === '/enrich') {
			return route.includes('/enrich') && !route.includes('/enrich/reverse') && !route.includes('/enrich/crm');
		}
		// For "CRM" (the default integrations), match only when NOT on /integrations/engagement or /integrations/api
		if (item.match === '/integrations' && !item.match.includes('/engagement') && !item.match.includes('/api')) {
			return route.includes('/integrations') && !route.includes('/integrations/engagement') && !route.includes('/integrations/api');
		}
		// For "All Contacts" (/prospects), match only exact — not /prospects/lists or /prospects/[id]
		if (item.match === '/prospects' && !item.match.includes('/lists')) {
			return route.endsWith('/prospects') || route.endsWith('/prospects/');
		}
		// For "Lists" (/prospects/lists), also match /prospects/[id] (list detail pages)
		if (item.match === '/prospects/lists') {
			return route.includes('/prospects/lists') || (route.includes('/prospects/') && !route.endsWith('/prospects') && !route.endsWith('/prospects/'));
		}
		return route.includes(item.match);
	}
</script>

{#if activeSection}
	<div class="subnav border-grey-200 flex h-10 w-full items-center gap-1 border-b bg-white px-6">
		{#each activeSection.items as item}
			<a
				class="relative flex h-10 items-center px-3 text-sm font-medium transition-colors"
				class:active={isActive(item)}
				class:text-grey-500={!isActive(item)}
				href="{base}{item.href}"
			>
				{item.label}
			</a>
		{/each}
	</div>
{/if}

<style>
	.subnav a {
		position: relative;
	}

	.subnav a.active {
		color: var(--Violet-800, #4b25bb);
		font-weight: 600;
	}

	.subnav a.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 12px;
		right: 12px;
		height: 2px;
		background-color: var(--Violet-800, #4b25bb);
		border-radius: 1px;
	}

	.subnav a:not(.active):hover {
		color: var(--Grey-900, #18151e);
	}
</style>
