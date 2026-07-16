<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';
	import { v6Store } from '$lib/mock/v6.svelte';
	import ExportPopover from '$lib/components/ExportPopover.svelte';

	let base = $derived(`${svelteBase}/${$page.params.version}`);
	let version = $derived($page.params.version);

	// V3: All Contacts — flat view of every contact across all sources
	const allContacts = [
		{ id: '1', name: 'Sarah Chen', title: 'VP of Sales', company: 'Stripe', location: 'San Francisco, US', source: 'search', status: 'enriched', email: 'sarah.chen@stripe.com', emailStatus: 'valid', phone: '+1 415 555 0101' },
		{ id: '2', name: 'James Rodriguez', title: 'Head of Marketing', company: 'HubSpot', location: 'Boston, US', source: 'csv', status: 'enriched', email: 'james.r@hubspot.com', emailStatus: 'valid', phone: '+1 617 555 0202' },
		{ id: '3', name: 'Emma Dubois', title: 'CTO', company: 'Datadog', location: 'Paris, France', source: 'search', status: 'enriched', email: 'emma.d@datadoghq.com', emailStatus: 'valid', phone: '+33 1 55 03 03' },
		{ id: '4', name: 'Michael Park', title: 'Director of Engineering', company: 'Notion', location: 'New York, US', source: 'reverse', status: 'enriched', email: 'michael.p@notion.so', emailStatus: 'valid', phone: '' },
		{ id: '5', name: 'Laura Bianchi', title: 'CEO', company: 'Factorial', location: 'Barcelona, Spain', source: 'search', status: 'enriched', email: 'laura@factorial.co', emailStatus: 'catch-all', phone: '+34 93 555 0505' },
		{ id: '6', name: 'David Kim', title: 'VP of Product', company: 'Figma', location: 'San Francisco, US', source: 'csv', status: 'enriched', email: 'david.k@figma.com', emailStatus: 'valid', phone: '+1 415 555 0606' },
		{ id: '7', name: 'Sophie Martin', title: 'Sales Director', company: 'Aircall', location: 'Paris, France', source: 'reverse', status: 'enriched', email: 'sophie.m@aircall.io', emailStatus: 'valid', phone: '+33 1 55 07 07' },
		{ id: '8', name: 'Alex Thompson', title: 'Head of Growth', company: 'Loom', location: 'San Francisco, US', source: 'crm', status: 'enriched', email: 'alex.t@loom.com', emailStatus: 'invalid', phone: '' },
		{ id: '9', name: 'Maria Garcia', title: 'CMO', company: 'Typeform', location: 'Barcelona, Spain', source: 'search', status: 'enriched', email: 'maria.g@typeform.com', emailStatus: 'valid', phone: '+34 93 555 0909' },
		{ id: '10', name: 'Thomas Weber', title: 'VP Engineering', company: 'Personio', location: 'Munich, Germany', source: 'csv', status: 'enriched', email: 'thomas.w@personio.de', emailStatus: 'valid', phone: '+49 89 555 1010' },
		{ id: '11', name: 'Olivia Brown', title: 'Director of Sales', company: 'Gong', location: 'San Francisco, US', source: 'search', status: 'enriched', email: 'olivia.b@gong.io', emailStatus: 'valid', phone: '+1 415 555 1111' },
		{ id: '12', name: 'Lucas Moreau', title: 'COO', company: 'Spendesk', location: 'Paris, France', source: 'crm', status: 'enriched', email: 'lucas.m@spendesk.com', emailStatus: 'valid', phone: '+33 1 55 12 12' },
	];

	const sourceLabels: Record<string, { label: string; color: string }> = {
		search: { label: 'Search', color: 'text-violet-700 bg-violet-50' },
		csv: { label: 'CSV', color: 'text-blue-700 bg-blue-50' },
		reverse: { label: 'Reverse', color: 'text-amber-700 bg-amber-50' },
		crm: { label: 'CRM', color: 'text-orange-700 bg-orange-50' },
	};

	const emailStatusLabels: Record<string, { label: string; color: string }> = {
		valid: { label: 'Valid', color: 'text-emerald-700 bg-emerald-50' },
		invalid: { label: 'Invalid', color: 'text-red-700 bg-red-50' },
		'catch-all': { label: 'Catch-all', color: 'text-amber-700 bg-amber-50' },
	};

	let listExportPopoverId = $state('');

	// V6: mixed lists (people + company)
	let v6Lists = $derived(v6Store.lists);
	let v6NewListOpen = $state(false);
	let v6NewListName = $state('');
	let v6NewListType = $state<'people' | 'company'>('people');
	let v6ExportOpenId = $state('');
	let v6ExportBool = $state(false);

	const v6SourceBadge: Record<string, { label: string; color: string }> = {
		search:  { label: 'Search',  color: 'text-violet-700 bg-violet-50' },
		csv:     { label: 'CSV',     color: 'text-blue-700 bg-blue-50' },
		reverse: { label: 'Reverse', color: 'text-amber-700 bg-amber-50' },
		manual:  { label: 'Manual',  color: 'text-emerald-700 bg-emerald-50' },
		job:     { label: 'Job',     color: 'text-grey-600 bg-grey-100' },
	};

	function v6CreateList() {
		if (!v6NewListName.trim()) return;
		toast.show(`List "${v6NewListName}" created`);
		v6NewListName = '';
		v6NewListType = 'people';
		v6NewListOpen = false;
	}

	// V1/V2: Lists view
	type ProspectList = {
		id: string;
		name: string;
		count: number;
		enriched: number;
		crmSynced: boolean;
		owner: string;
		updated: string;
		source?: string;
	};

	const lists: ProspectList[] = [
		{ id: '1', name: 'SaaS Founders Q1', count: 234, enriched: 198, crmSynced: true, owner: 'Francis', updated: '2 hours ago', source: 'search' },
		{ id: '2', name: 'VP Sales Software', count: 187, enriched: 162, crmSynced: false, owner: 'Francis', updated: '1 day ago', source: 'search' },
		{ id: '3', name: 'Series B Startups', count: 412, enriched: 387, crmSynced: true, owner: 'Marie', updated: '3 days ago', source: 'csv' },
		{ id: '4', name: 'European Marketing Leads', count: 156, enriched: 89, crmSynced: false, owner: 'Francis', updated: '5 days ago', source: 'search' },
		{ id: '5', name: 'Agency Owners USA', count: 89, enriched: 45, crmSynced: false, owner: 'Thomas', updated: '1 week ago', source: 'manual' },
		{ id: '6', name: 'Newsletter Reverse Lookup', count: 67, enriched: 52, crmSynced: true, owner: 'Francis', updated: '2 weeks ago', source: 'reverse' },
		{ id: '7', name: 'Clay Workflow Import', count: 320, enriched: 298, crmSynced: true, owner: 'Marie', updated: '2 weeks ago', source: 'csv' },
		{ id: '8', name: 'Claude MCP Batch', count: 50, enriched: 50, crmSynced: false, owner: 'Francis', updated: '3 weeks ago', source: 'manual' },
	];

	const listSourceLabels: Record<string, { label: string; color: string }> = {
		search: { label: 'Search', color: 'text-violet-700 bg-violet-50' },
		csv: { label: 'CSV', color: 'text-blue-700 bg-blue-50' },
		reverse: { label: 'Reverse', color: 'text-amber-700 bg-amber-50' },
		manual: { label: 'Manual', color: 'text-emerald-700 bg-emerald-50' },
	};

	let selectedContacts: Set<string> = $state(new Set());
	let selectedLists: Set<string> = $state(new Set());

	function toggleContact(id: string) {
		const next = new Set(selectedContacts);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selectedContacts = next;
	}

	function toggleAllContacts() {
		if (selectedContacts.size === allContacts.length) {
			selectedContacts = new Set();
		} else {
			selectedContacts = new Set(allContacts.map((c) => c.id));
		}
	}

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

{#if version === 'v3'}
<!-- V3: All Contacts — flat view of every contact across all sources -->
<div class="flex h-full flex-col">
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h1 class="text-grey-900 text-base font-semibold">All Contacts</h1>
			<span class="text-grey-500 text-sm">{allContacts.length} contacts</span>
		</div>
		<div class="flex items-center gap-2">
			{#if selectedContacts.size > 0}
				<span class="text-grey-600 mr-2 text-sm">{selectedContacts.size} selected</span>
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show(`Enriching ${selectedContacts.size} contact${selectedContacts.size > 1 ? 's' : ''}...`)}>
					<span class="material-icons-round text-grey-600 text-base">auto_awesome</span>
					Enrich
				</button>
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Export started — CSV will download shortly')}>
					<span class="material-icons-round text-grey-600 text-base">download</span>
					Export CSV
				</button>
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" style="color: #ff7a59;" onclick={() => toast.show('Contacts pushed to HubSpot')}>
					<span class="material-icons-round text-base">hub</span>
					Push to HubSpot
				</button>
			{/if}
		</div>
	</div>

	<div class="flex-1 overflow-auto">
		<table class="w-full min-w-[1100px]">
			<thead class="sticky top-0 z-10">
				<tr class="table-header">
					<th class="w-12 px-4 py-3">
						<input type="checkbox" checked={selectedContacts.size === allContacts.length} onchange={toggleAllContacts} />
					</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Contact</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email status</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Source</th>
				</tr>
			</thead>
			<tbody class="bg-white">
				{#each allContacts as contact}
					<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
						<td class="px-4 py-3">
							<input type="checkbox" checked={selectedContacts.has(contact.id)} onchange={() => toggleContact(contact.id)} />
						</td>
						<td class="px-4 py-3">
							<div>
								<p class="text-grey-900 text-sm font-medium">{contact.name}</p>
								<p class="text-grey-500 text-xs">{contact.title}</p>
							</div>
						</td>
						<td class="px-4 py-3">
							<div>
								<p class="text-grey-700 text-sm">{contact.company}</p>
								<p class="text-grey-500 text-xs">{contact.location}</p>
							</div>
						</td>
						<td class="px-4 py-3">
							{#if contact.phone}
								<span class="text-grey-900 font-mono text-xs">{contact.phone}</span>
							{:else}
								<span class="text-grey-300 text-xs">—</span>
							{/if}
						</td>
						<td class="px-4 py-3">
							<span class="text-grey-900 font-mono text-xs">{contact.email}</span>
						</td>
						<td class="px-4 py-3">
							<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {emailStatusLabels[contact.emailStatus].color}">
								{emailStatusLabels[contact.emailStatus].label}
							</span>
						</td>
						<td class="px-4 py-3">
							<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {sourceLabels[contact.source].color}">
								{sourceLabels[contact.source].label}
							</span>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

{:else if version === 'v4'}
<!-- V4: Unified Lists — all sources, universal Export, optional organization -->
<div class="flex h-full flex-col">
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
			{/if}
			<button class="btn-primary h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('New list created')}>
				<span class="material-icons-round text-sm text-white">add</span>
				New List
			</button>
		</div>
	</div>

	<div class="flex-1 overflow-auto">
		<table class="w-full min-w-[900px]">
			<thead class="sticky top-0 z-10">
				<tr class="table-header">
					<th class="w-12 px-4 py-3">
						<input type="checkbox" checked={selectedLists.size === lists.length && lists.length > 0} onchange={toggleAll} />
					</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">List</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Source</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Contacts</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Enriched</th>
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
						<td class="px-4 py-3">
							{#if list.source && listSourceLabels[list.source]}
								<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {listSourceLabels[list.source].color}">
									{listSourceLabels[list.source].label}
								</span>
							{/if}
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
						<td class="text-grey-700 px-4 py-3 text-sm">{list.owner}</td>
						<td class="text-grey-500 px-4 py-3 text-sm">{list.updated}</td>
						<td class="px-4 py-3 text-right">
							<div class="flex items-center justify-end gap-1">
								<button class="btn-ghost h-7 w-7 p-0" title="Enrich" onclick={() => toast.show(`Enriching "${list.name}"...`)}>
									<span class="material-icons-round text-grey-500 text-base">auto_awesome</span>
								</button>
								<div class="relative">
									<button class="btn-ghost h-7 w-7 p-0" title="Export" onclick={() => { listExportPopoverId = listExportPopoverId === list.id ? '' : list.id; }}>
										<span class="material-icons-round text-grey-500 text-base">download</span>
									</button>
									{#if listExportPopoverId === list.id}
										<div class="absolute right-0 top-8 z-20 w-52 rounded-xl border border-grey-200 bg-white p-1.5 shadow-lg">
											<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800" onclick={() => { listExportPopoverId = ''; toast.show(`"${list.name}" pushed to HubSpot`); }}>
												<span class="material-icons-round text-base" style="color: #ff7a59;">hub</span>
												Push to CRM
											</button>
											<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800" onclick={() => { listExportPopoverId = ''; toast.show(`Exporting "${list.name}"...`); }}>
												<span class="material-icons-round text-grey-500 text-base">description</span>
												Export CSV
											</button>
											<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800" onclick={() => { listExportPopoverId = ''; toast.show('Pushed to Outreach'); }}>
												<span class="material-icons-round text-grey-500 text-base">campaign</span>
												Push to engagement tool
											</button>
										</div>
									{/if}
								</div>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

{:else if version === 'v6'}
<!-- V6: Unified lists — people + company, flat table -->
<div class="flex h-full flex-col">
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h1 class="text-grey-900 text-base font-semibold">Lists</h1>
			<span class="text-grey-500 text-sm">{v6Lists.length} lists</span>
		</div>
		<button class="btn-primary h-8 gap-1.5 px-3 text-sm" onclick={() => { v6NewListOpen = true; }}>
			<span class="material-icons-round text-sm text-white">add</span>
			New list
		</button>
	</div>

	<!-- New list modal -->
	{#if v6NewListOpen}
		<button class="fixed inset-0 z-40 bg-black/20" onclick={() => { v6NewListOpen = false; }} aria-label="Close modal"></button>
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div class="w-full max-w-sm rounded-2xl border border-grey-200 bg-white p-6 shadow-xl">
				<h2 class="text-grey-900 mb-4 text-base font-semibold">New list</h2>
				<label class="mb-3 block">
					<span class="text-grey-700 mb-1 block text-sm font-medium">Name</span>
					<input
						type="text"
						class="border-grey-300 text-grey-900 w-full rounded-lg border px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
						placeholder="e.g. Q3 Targets"
						bind:value={v6NewListName}
					/>
				</label>
				<fieldset class="mb-5">
					<legend class="text-grey-700 mb-1 block text-sm font-medium">Type</legend>
					<div class="flex gap-3">
						<label class="flex cursor-pointer items-center gap-2 text-sm text-grey-800">
							<input type="radio" name="v6-list-type" value="people" bind:group={v6NewListType} class="accent-violet-700" />
							People list
						</label>
						<label class="flex cursor-pointer items-center gap-2 text-sm text-grey-800">
							<input type="radio" name="v6-list-type" value="company" bind:group={v6NewListType} class="accent-violet-700" />
							Company list
						</label>
					</div>
				</fieldset>
				<div class="flex justify-end gap-2">
					<button class="btn-ghost h-8 px-4 text-sm" onclick={() => { v6NewListOpen = false; }}>Cancel</button>
					<button class="btn-primary h-8 px-4 text-sm" onclick={v6CreateList}>Create</button>
				</div>
			</div>
		</div>
	{/if}

	<div class="flex-1 overflow-auto">
		<table class="w-full min-w-[960px]">
			<thead class="sticky top-0 z-10">
				<tr class="table-header">
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Count</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Enriched</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sources</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Owner</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Updated</th>
					<th class="text-grey-600 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
				</tr>
			</thead>
			<tbody class="bg-white">
				{#each v6Lists as list}
					<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
						<!-- Type badge -->
						<td class="px-4 py-3">
							{#if list.type === 'people'}
								<span class="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">People</span>
							{:else}
								<span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Company</span>
							{/if}
						</td>
						<!-- Name -->
						<td class="px-4 py-3">
							<a href="{svelteBase}/{$page.params.version}/app/prospects/{list.id}" class="text-grey-900 text-sm font-medium hover:text-violet-700">{list.name}</a>
						</td>
						<!-- Count -->
						<td class="text-grey-700 px-4 py-3 text-sm">{list.memberIds.length}</td>
						<!-- Enriched -->
						<td class="px-4 py-3">
							{#if list.type === 'people'}
								<div class="flex items-center gap-2">
									<div class="bg-grey-200 h-1.5 w-16 overflow-hidden rounded-full">
										<div class="h-full rounded-full bg-emerald-500" style:width="{list.enrichedPercent}%"></div>
									</div>
									<span class="text-grey-600 text-xs">{list.enrichedPercent}%</span>
								</div>
							{:else}
								<span class="text-grey-300 text-xs">—</span>
							{/if}
						</td>
						<!-- Sources -->
						<td class="px-4 py-3">
							<div class="flex flex-wrap gap-1">
								{#each list.sources as src}
									{#if v6SourceBadge[src]}
										<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {v6SourceBadge[src].color}">{v6SourceBadge[src].label}</span>
									{/if}
								{/each}
							</div>
						</td>
						<!-- Owner -->
						<td class="text-grey-700 px-4 py-3 text-sm">{list.owner}</td>
						<!-- Updated -->
						<td class="text-grey-500 px-4 py-3 text-sm">{list.updatedAt}</td>
						<!-- Actions -->
						<td class="px-4 py-3 text-right">
							<div class="flex items-center justify-end gap-1">
								{#if list.type === 'people'}
									<button
										class="btn-ghost h-7 gap-1 px-2 text-xs"
										title="Enrich"
										onclick={() => toast.show(`Enrichment started for "${list.name}" — results will flow back into the list`)}
									>
										<span class="material-icons-round text-grey-500 text-base">auto_awesome</span>
										Enrich
									</button>
								{/if}
								<div class="relative">
									<button
										class="btn-ghost h-7 w-7 p-0"
										title="Export"
										onclick={() => {
											if (v6ExportOpenId === list.id) {
												v6ExportOpenId = '';
												v6ExportBool = false;
											} else {
												v6ExportOpenId = list.id;
												v6ExportBool = true;
											}
										}}
									>
										<span class="material-icons-round text-grey-500 text-base">download</span>
									</button>
									{#if v6ExportOpenId === list.id}
										<ExportPopover
											bind:open={v6ExportBool}
											context={list.type === 'people' ? 'people' : 'companies'}
											count={list.memberIds.length}
											sourceName={list.name}
										/>
									{/if}
								</div>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

{:else if version === 'v7'}
<!-- V7: Lists as single object — enrichment status inline -->
<div class="flex h-full flex-col">
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h1 class="text-grey-900 text-base font-semibold">Lists</h1>
			<span class="text-grey-500 text-sm">{v6Lists.length} lists</span>
		</div>
		<button class="btn-primary h-8 gap-1.5 px-3 text-sm" onclick={() => { v6NewListOpen = true; }}>
			<span class="material-icons-round text-sm text-white">add</span>
			New list
		</button>
	</div>

	<!-- New list modal — reuse v6 modal -->
	{#if v6NewListOpen}
		<button class="fixed inset-0 z-40 bg-black/20" onclick={() => { v6NewListOpen = false; }} aria-label="Close modal"></button>
		<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div class="w-full max-w-sm rounded-2xl border border-grey-200 bg-white p-6 shadow-xl">
				<h2 class="text-grey-900 mb-4 text-base font-semibold">New list</h2>
				<label class="mb-3 block">
					<span class="text-grey-700 mb-1 block text-sm font-medium">Name</span>
					<input
						type="text"
						class="border-grey-300 text-grey-900 w-full rounded-lg border px-3 py-2 text-sm focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
						placeholder="e.g. Q3 Targets"
						bind:value={v6NewListName}
					/>
				</label>
				<fieldset class="mb-5">
					<legend class="text-grey-700 mb-1 block text-sm font-medium">Type</legend>
					<div class="flex gap-3">
						<label class="flex cursor-pointer items-center gap-2 text-sm text-grey-800">
							<input type="radio" name="v7-list-type" value="people" bind:group={v6NewListType} class="accent-violet-700" />
							People list
						</label>
						<label class="flex cursor-pointer items-center gap-2 text-sm text-grey-800">
							<input type="radio" name="v7-list-type" value="company" bind:group={v6NewListType} class="accent-violet-700" />
							Company list
						</label>
					</div>
				</fieldset>
				<div class="flex justify-end gap-2">
					<button class="btn-ghost h-8 px-4 text-sm" onclick={() => { v6NewListOpen = false; }}>Cancel</button>
					<button class="btn-primary h-8 px-4 text-sm" onclick={v6CreateList}>Create</button>
				</div>
			</div>
		</div>
	{/if}

	<div class="flex-1 overflow-auto">
		<table class="w-full min-w-[960px]">
			<thead class="sticky top-0 z-10">
				<tr class="table-header">
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Count</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Enrichment</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sources</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Owner</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Updated</th>
					<th class="text-grey-600 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
				</tr>
			</thead>
			<tbody class="bg-white">
				{#each v6Lists as list}
					{@const listRuns = v6Store.getRunsForList(list.id)}
					{@const activeRun = listRuns.find(r => r.status === 'running')}
					<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors {activeRun ? 'bg-amber-50/20' : ''}">
						<!-- Type badge -->
						<td class="px-4 py-3">
							{#if list.type === 'people'}
								<span class="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">People</span>
							{:else}
								<span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Company</span>
							{/if}
						</td>
						<!-- Name -->
						<td class="px-4 py-3">
							<a href="{svelteBase}/{$page.params.version}/app/prospects/{list.id}" class="text-grey-900 text-sm font-medium hover:text-violet-700">{list.name}</a>
						</td>
						<!-- Count -->
						<td class="text-grey-700 px-4 py-3 text-sm">{list.memberIds.length}</td>
						<!-- Enrichment status — the key V7 difference -->
						<td class="px-4 py-3">
							{#if activeRun}
								<div class="flex items-center gap-2">
									<span class="material-icons-round text-amber-500 text-sm animate-spin" style="animation-duration:1.5s">sync</span>
									<div class="flex items-center gap-1.5">
										<div class="bg-grey-200 h-1.5 w-14 overflow-hidden rounded-full">
											<div class="h-full rounded-full bg-amber-400" style:width="{activeRun.progress}%"></div>
										</div>
										<span class="text-amber-700 text-xs font-medium">{activeRun.progress}%</span>
									</div>
								</div>
							{:else if list.type === 'people' && list.enrichedPercent > 0}
								<div class="flex items-center gap-2">
									<div class="bg-grey-200 h-1.5 w-14 overflow-hidden rounded-full">
										<div class="h-full rounded-full bg-emerald-500" style:width="{list.enrichedPercent}%"></div>
									</div>
									<span class="text-grey-600 text-xs">{list.enrichedPercent}%</span>
									{#if listRuns.length > 0}
										<span class="text-grey-400 text-xs">· {listRuns.length} run{listRuns.length > 1 ? 's' : ''}</span>
									{/if}
								</div>
							{:else if list.type === 'people'}
								<span class="text-grey-400 text-xs">Not enriched</span>
							{:else}
								<span class="text-grey-300 text-xs">—</span>
							{/if}
						</td>
						<!-- Sources -->
						<td class="px-4 py-3">
							<div class="flex flex-wrap gap-1">
								{#each list.sources as src}
									{#if v6SourceBadge[src]}
										<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {v6SourceBadge[src].color}">{v6SourceBadge[src].label}</span>
									{/if}
								{/each}
							</div>
						</td>
						<!-- Owner -->
						<td class="text-grey-700 px-4 py-3 text-sm">{list.owner}</td>
						<!-- Updated -->
						<td class="text-grey-500 px-4 py-3 text-sm">{list.updatedAt}</td>
						<!-- Actions -->
						<td class="px-4 py-3 text-right">
							<div class="flex items-center justify-end gap-1">
								{#if list.type === 'people'}
									<a
										href="{svelteBase}/{$page.params.version}/app/enrich"
										class="btn-ghost h-7 gap-1 px-2 text-xs"
										title="Enrich this list"
									>
										<span class="material-icons-round text-violet-500 text-base">auto_awesome</span>
										Enrich
									</a>
								{/if}
								<div class="relative">
									<button
										class="btn-ghost h-7 w-7 p-0"
										title="Export"
										onclick={() => {
											if (v6ExportOpenId === list.id) {
												v6ExportOpenId = '';
												v6ExportBool = false;
											} else {
												v6ExportOpenId = list.id;
												v6ExportBool = true;
											}
										}}
									>
										<span class="material-icons-round text-grey-500 text-base">download</span>
									</button>
									{#if v6ExportOpenId === list.id}
										<ExportPopover
											bind:open={v6ExportBool}
											context={list.type === 'people' ? 'people' : 'companies'}
											count={list.memberIds.length}
											sourceName={list.name}
										/>
									{/if}
								</div>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

{:else}
<!-- V1/V2: Lists view -->
<div class="flex h-full flex-col">
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h1 class="text-grey-900 text-base font-semibold">{version === 'v2' ? 'Lists' : 'Prospects'}</h1>
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
			<a href="{base}/app/enrich" class="btn-primary h-8 gap-1.5 px-3 text-sm">
				<span class="material-icons-round text-sm text-white">add</span>
				New List
			</a>
		</div>
	</div>

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
{/if}
