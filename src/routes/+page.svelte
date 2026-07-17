<script lang="ts">
	import { base } from '$app/paths';

	const versions = [
		{ id: 'v1', name: 'Version 1 — Current', desc: 'Current FullEnrich app structure (baseline)', entry: 'search' },
		{ id: 'v2', name: 'Version 2 — B2B Data Engine', desc: 'Find, Enrich, Push. Search + Enrichment + Lists + Integrations.', entry: 'search' },
		{ id: 'v3', name: "Version 3 — Lusha's Model", desc: 'All Contacts + Lists. Enriched contacts flow into a global contact database.', entry: 'search' },
		{ id: 'v4', name: 'Version 4 — Find, Enrich, Push', desc: 'Unified lists, universal Export action, optional list organization. Enrichment from search goes to a list; CSV/manual enrichments are standalone jobs.', entry: 'search' },
		{ id: 'v6', name: 'Version 6 — Jobs + Parallel Lists', desc: 'Jobs table + parallel Lists. One launcher, universal export, company bundles.', entry: 'search' },
		{ id: 'v7', name: 'Version 7 — Lists Only', desc: 'Lists as the single object. Enrichment is a launcher + activity feed. Results always flow into lists. Onboarding routes you to the right section.', entry: 'search' },
		{ id: 'v8', name: 'Version 8 — Auto Lists + Jobs', desc: 'Every enrichment auto-creates a list. Lists are the single object. Auto-created lists have provenance tags and can become manual lists.', entry: 'search' },
	];
</script>

<div class="flex min-h-screen items-center justify-center bg-[#f8f7fa]">
	<div class="w-full max-w-md px-6">
		<div class="mb-8 text-center">
			<h1 class="text-grey-900 text-2xl font-semibold">FullEnrich Structure Lab</h1>
			<p class="text-grey-600 mt-2 text-sm">Pick a version to explore</p>
		</div>
		<div class="flex flex-col gap-3">
			{#each versions as v}
				<a
					href="{base}/{v.id}/app/{v.entry}"
					class="border-grey-200 hover:border-violet-300 hover:bg-violet-50/30 flex flex-col rounded-xl border bg-white px-5 py-4 shadow-sm transition-all"
				>
					<span class="text-grey-900 font-semibold">{v.name}</span>
					<span class="text-grey-500 mt-1 text-sm">{v.desc}</span>
				</a>
			{/each}
		</div>
	</div>
</div>
