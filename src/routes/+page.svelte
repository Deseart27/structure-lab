<script lang="ts">
	import { base } from '$app/paths';

	const versions = [
		{ id: 'v1', name: 'Version 1 — Current', desc: 'Current FullEnrich app structure (baseline)', entry: 'search' },
		{ id: 'v2', name: 'Version 2 — Unified', desc: 'Search + Enrich + Prospects + Integrations. Unified lists, consistent actions, no silos.', entry: 'search' },
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
					class="border-grey-200 hover:border-violet-300 hover:bg-violet-50/30 flex flex-col rounded-xl border bg-white px-5 py-4 transition-colors"
				>
					<span class="text-grey-900 font-semibold">{v.name}</span>
					<span class="text-grey-500 mt-1 text-sm">{v.desc}</span>
				</a>
			{/each}
		</div>
	</div>
</div>
