<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';

	let base = $derived(`${svelteBase}/${$page.params.version}`);

	type ProspectList = {
		id: string;
		name: string;
		count: number;
		enriched: number;
		source: 'search' | 'csv' | 'manual' | 'reverse' | 'api' | 'mcp';
		status: 'enriched' | 'partial' | 'pending';
		crmSynced: boolean;
		owner: string;
		updated: string;
	};

	const lists: ProspectList[] = [
		{ id: '1', name: 'SaaS Founders Q1', count: 234, enriched: 198, source: 'search', status: 'enriched', crmSynced: true, owner: 'Francis', updated: '2 hours ago' },
		{ id: '2', name: 'VP Sales Software', count: 187, enriched: 162, source: 'search', status: 'enriched', crmSynced: false, owner: 'Francis', updated: '1 day ago' },
		{ id: '3', name: 'Series B Startups', count: 412, enriched: 387, source: 'csv', status: 'enriched', crmSynced: true, owner: 'Marie', updated: '3 days ago' },
		{ id: '4', name: 'European Marketing Leads', count: 156, enriched: 89, source: 'csv', status: 'partial', crmSynced: false, owner: 'Francis', updated: '5 days ago' },
		{ id: '5', name: 'Agency Owners USA', count: 89, enriched: 45, source: 'manual', status: 'partial', crmSynced: false, owner: 'Thomas', updated: '1 week ago' },
		{ id: '6', name: 'Newsletter Reverse Lookup', count: 67, enriched: 52, source: 'reverse', status: 'enriched', crmSynced: true, owner: 'Francis', updated: '2 weeks ago' },
		{ id: '7', name: 'Clay Workflow Import', count: 320, enriched: 298, source: 'api', status: 'enriched', crmSynced: true, owner: 'Marie', updated: '2 weeks ago' },
		{ id: '8', name: 'Claude MCP Batch', count: 50, enriched: 50, source: 'mcp', status: 'enriched', crmSynced: false, owner: 'Francis', updated: '3 weeks ago' },
	];

	const sourceLabels: Record<string, { label: string; icon: string; color: string }> = {
		search: { label: 'Search', icon: 'search', color: 'text-blue-600 bg-blue-50' },
		csv: { label: 'CSV', icon: 'upload_file', color: 'text-orange-600 bg-orange-50' },
		manual: { label: 'Manual', icon: 'edit', color: 'text-violet-600 bg-violet-50' },
		reverse: { label: 'Reverse', icon: 'person_search', color: 'text-emerald-600 bg-emerald-50' },
		api: { label: 'API', icon: 'api', color: 'text-pink-600 bg-pink-50' },
		mcp: { label: 'MCP', icon: 'smart_toy', color: 'text-indigo-600 bg-indigo-50' },
	};

	let selectedFilter: 'all' | 'search' | 'csv' | 'manual' | 'reverse' | 'api' | 'mcp' = $state('all');
	let selectedLists: Set<string> = $state(new Set());

	let filteredLists = $derived(
		selectedFilter === 'all' ? lists : lists.filter((l) => l.source === selectedFilter)
	);

	function toggleList(id: string) {
		const next = new Set(selectedLists);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selectedLists = next;
	}

	function toggleAll() {
		if (selectedLists.size === filteredLists.length) {
			selectedLists = new Set();
		} else {
			selectedLists = new Set(filteredLists.map((l) => l.id));
		}
	}
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h1 class="text-grey-900 text-base font-semibold">Lists</h1>
			<span class="text-grey-500 text-sm">{lists.length} lists &middot; {lists.reduce((s, l) => s + l.count, 0).toLocaleString()} contacts</span>
		</div>
		<div class="flex items-center gap-2">
			{#if selectedLists.size > 0}
				<span class="text-grey-600 mr-2 text-sm">{selectedLists.size} selected</span>
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm">
					<span class="material-icons-round text-grey-600 text-base">auto_awesome</span>
					Enrich
				</button>
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm">
					<span class="material-icons-round text-grey-600 text-base">download</span>
					Export
				</button>
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" style="color: #ff7a59;">
					<span class="material-icons-round text-base">hub</span>
					Push to HubSpot
				</button>
			{/if}
			<a href="{base}/app/find" class="btn-primary h-8 gap-1.5 px-3 text-sm">
				<span class="material-icons-round text-sm text-white">add</span>
				New List
			</a>
		</div>
	</div>

	<!-- Filter tabs -->
	<div class="border-grey-200 flex items-center gap-2 border-b px-6 py-2">
		{#each [
			{ id: 'all', label: 'All' },
			{ id: 'search', label: 'Search' },
			{ id: 'csv', label: 'CSV' },
			{ id: 'manual', label: 'Manual' },
			{ id: 'reverse', label: 'Reverse' },
			{ id: 'api', label: 'API' },
			{ id: 'mcp', label: 'MCP' },
		] as tab}
			<button
				class="h-7 rounded-full px-2.5 text-xs font-medium transition-colors"
				class:bg-grey-100={selectedFilter === tab.id}
				class:text-grey-900={selectedFilter === tab.id}
				class:text-grey-500={selectedFilter !== tab.id}
				onclick={() => { selectedFilter = tab.id as typeof selectedFilter; }}
			>
				{tab.label}
			</button>
		{/each}
	</div>

	<!-- Table -->
	<div class="flex-1 overflow-auto">
		<table class="w-full min-w-[900px]">
			<thead class="bg-grey-50 sticky top-0 z-10">
				<tr class="border-grey-200 border-b">
					<th class="w-12 px-4 py-3">
						<input type="checkbox" checked={selectedLists.size === filteredLists.length && filteredLists.length > 0} onchange={toggleAll} />
					</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">List</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Source</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Contacts</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Enriched</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">CRM</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Owner</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Updated</th>
					<th class="text-grey-600 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
				</tr>
			</thead>
			<tbody class="bg-white">
				{#each filteredLists as list}
					<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
						<td class="px-4 py-3">
							<input type="checkbox" checked={selectedLists.has(list.id)} onchange={() => toggleList(list.id)} />
						</td>
						<td class="px-4 py-3">
							<a href="{base}/app/prospects/{list.id}" class="text-grey-900 text-sm font-medium hover:text-violet-700">{list.name}</a>
						</td>
						<td class="px-4 py-3">
							<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium {sourceLabels[list.source].color}">
								<span class="material-icons-round text-xs">{sourceLabels[list.source].icon}</span>
								{sourceLabels[list.source].label}
							</span>
						</td>
						<td class="text-grey-700 px-4 py-3 text-sm">{list.count.toLocaleString()}</td>
						<td class="px-4 py-3">
							<div class="flex items-center gap-2">
								<div class="bg-grey-200 h-1.5 w-16 overflow-hidden rounded-full">
									<div class="h-full rounded-full bg-emerald-500" style:width="{Math.round((list.enriched / list.count) * 100)}%"></div>
								</div>
								<span class="text-grey-600 text-xs">{Math.round((list.enriched / list.count) * 100)}%</span>
							</div>
						</td>
						<td class="px-4 py-3">
							{#if list.crmSynced}
								<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
									<span class="material-icons-round text-xs">check_circle</span>
									Synced
								</span>
							{:else}
								<span class="text-grey-400 text-xs">Not synced</span>
							{/if}
						</td>
						<td class="text-grey-700 px-4 py-3 text-sm">{list.owner}</td>
						<td class="text-grey-500 px-4 py-3 text-sm">{list.updated}</td>
						<td class="px-4 py-3 text-right">
							<div class="flex items-center justify-end gap-1">
								<button class="btn-ghost h-7 w-7 p-0" title="Enrich">
									<span class="material-icons-round text-grey-500 text-base">auto_awesome</span>
								</button>
								<button class="btn-ghost h-7 w-7 p-0" title="Export">
									<span class="material-icons-round text-grey-500 text-base">download</span>
								</button>
								<button class="btn-ghost h-7 w-7 p-0" title="Push to HubSpot">
									<span class="material-icons-round text-base" style="color: #ff7a59;">hub</span>
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
