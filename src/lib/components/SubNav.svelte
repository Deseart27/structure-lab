<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';

	let route = $derived($page.url.pathname);
	let base = $derived(`${svelteBase}/${$page.params.version}`);

	type SubItem = { label: string; href: string; match: string };

	type SectionConfig = {
		section: string;
		match: string;
		items: SubItem[];
	};

	const sections: SectionConfig[] = [
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

	let activeSection = $derived(sections.find((s) => route.includes(s.match)));

	function isActive(item: SubItem): boolean {
		// For "Emails & Phones" (the default enrich), match exactly — not when on /enrich/reverse or /enrich/crm
		if (item.match === '/enrich') {
			return route.includes('/enrich') && !route.includes('/enrich/reverse') && !route.includes('/enrich/crm');
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
