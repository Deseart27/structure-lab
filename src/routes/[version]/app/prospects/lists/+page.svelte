<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';

	let base = $derived(`${svelteBase}/${$page.params.version}`);

	type ProspectList = {
		id: string;
		name: string;
		count: number;
		enriched: number;
		crmSynced: boolean;
		owner: string;
		updated: string;
	};

	const lists: ProspectList[] = [
		{ id: '1', name: 'SaaS Founders Q1', count: 234, enriched: 198, crmSynced: true, owner: 'Francis', updated: '2 hours ago' },
		{ id: '2', name: 'VP Sales Software', count: 187, enriched: 162, crmSynced: false, owner: 'Francis', updated: '1 day ago' },
		{ id: '3', name: 'Series B Startups', count: 412, enriched: 387, crmSynced: true, owner: 'Marie', updated: '3 days ago' },
		{ id: '4', name: 'European Marketing Leads', count: 156, enriched: 89, crmSynced: false, owner: 'Francis', updated: '5 days ago' },
		{ id: '5', name: 'Agency Owners USA', count: 89, enriched: 45, crmSynced: false, owner: 'Thomas', updated: '1 week ago' },
	];

	let selectedLists: Set<string> = $state(new Set());

	function toggleList(id: string) {
		const next = new Set(selectedLists);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selectedLists = next;
	}

	function toggleAll() {
		if (selectedLists.size === lists.length) {
			selectedLists = new Set();
		} else {
			selectedLists = new Set(lists.map((l) => l.id));
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
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show(`Enriching ${selectedLists.size} list${selectedLists.size > 1 ? 's' : ''}...`)}>
					<span class="material-icons-round text-grey-600 text-base">auto_awesome</span>
					Enrich
				</button>
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Export started — CSV will download shortly')}>
					<span class="material-icons-round text-grey-600 text-base">download</span>
					Export CSV
				</button>
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" style="color: #ff7a59;" onclick={() => toast.show(`${selectedLists.size} list${selectedLists.size > 1 ? 's' : ''} pushed to HubSpot`)}>
					<span class="material-icons-round text-base">hub</span>
					Push to HubSpot
				</button>
			{/if}
			<a href="{base}/app/search/people" class="btn-primary h-8 gap-1.5 px-3 text-sm">
				<span class="material-icons-round text-sm text-white">add</span>
				New List
			</a>
		</div>
	</div>

	<!-- Table -->
	<div class="flex-1 overflow-auto">
		<table class="w-full min-w-[800px]">
			<thead class="sticky top-0 z-10">
				<tr class="table-header">
					<th class="w-12 px-4 py-3">
						<input type="checkbox" checked={selectedLists.size === lists.length && lists.length > 0} onchange={toggleAll} />
					</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">List</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Contacts</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Enriched</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">CRM</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Owner</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Updated</th>
					<th class="text-grey-600 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
				</tr>
			</thead>
			<tbody class="bg-white">
				{#each lists as list}
					<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
						<td class="px-4 py-3">
							<input type="checkbox" checked={selectedLists.has(list.id)} onchange={() => toggleList(list.id)} />
						</td>
						<td class="px-4 py-3">
							<a href="{base}/app/prospects/{list.id}" class="text-grey-900 text-sm font-medium hover:text-violet-700">{list.name}</a>
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
								<button class="btn-ghost h-7 w-7 p-0" title="Enrich" onclick={() => toast.show(`Enriching "${list.name}"...`)}>
									<span class="material-icons-round text-grey-500 text-base">auto_awesome</span>
								</button>
								<button class="btn-ghost h-7 w-7 p-0" title="Export CSV" onclick={() => toast.show(`Exporting "${list.name}"...`)}>
									<span class="material-icons-round text-grey-500 text-base">download</span>
								</button>
								<button class="btn-ghost h-7 w-7 p-0" title="Push to HubSpot" onclick={() => toast.show(`"${list.name}" pushed to HubSpot`)}>
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
