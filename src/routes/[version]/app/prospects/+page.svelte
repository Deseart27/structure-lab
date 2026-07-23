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

	// V9 state
	let enrichmentFilter = $derived($page.url.searchParams.get('enrichment'));
	let activeRun = $derived(enrichmentFilter ? v6Store.getRun(enrichmentFilter) : null);
	let v9FilteredContacts = $derived(
		(activeRun ? v6Store.getContactsForRun(activeRun) : [...v6Store.contacts])
			.sort((a, b) => {
				// Sort enriched contacts first (those with email)
				const aEnriched = a.email ? 1 : 0;
				const bEnriched = b.email ? 1 : 0;
				return bEnriched - aEnriched;
			})
	);
	let v9Selected = $state(new Set<string>());
	function v9ToggleContact(id: string) {
		const next = new Set(v9Selected);
		if (next.has(id)) next.delete(id); else next.add(id);
		v9Selected = next;
	}
	function v9ToggleAll() {
		if (v9Selected.size === v9FilteredContacts.length) {
			v9Selected = new Set();
		} else {
			v9Selected = new Set(v9FilteredContacts.map(c => c.id));
		}
	}

	import type { EmailStatus } from '$lib/mock/v6.svelte';
	const emailStatusStyles: Record<EmailStatus, { label: string; color: string }> = {
		valid: { label: 'Valid', color: 'text-emerald-700 bg-emerald-50' },
		'catch-all': { label: 'Catch-all', color: 'text-amber-700 bg-amber-50' },
		'invalid-found': { label: 'Invalid', color: 'text-orange-700 bg-orange-50' },
		'not-found': { label: 'Not found', color: 'text-grey-600 bg-grey-100' },
		pending: { label: 'Pending', color: 'text-blue-700 bg-blue-50' },
	};

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

{:else if version === 'v9'}
<!-- V9: All Contacts view — contact is the core object -->
<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h1 class="text-grey-900 text-base font-semibold">All Contacts</h1>
			<span class="text-grey-500 text-sm">{v9FilteredContacts.length}{activeRun ? ` of ${v6Store.contacts.length}` : ''} contacts</span>
		</div>
		<div class="flex items-center gap-2">
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Add contact — coming soon')}>
				<span class="material-icons-round text-grey-600 text-base">person_add</span>
				Add contact
			</button>
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Import CSV — coming soon')}>
				<span class="material-icons-round text-grey-600 text-base">upload_file</span>
				Import
			</button>
			<div class="relative">
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => { v6ExportBool = !v6ExportBool; }}>
					<span class="material-icons-round text-grey-600 text-base">download</span>
					Export
					<span class="material-icons-round text-grey-400 text-sm">expand_more</span>
				</button>
				<ExportPopover
					bind:open={v6ExportBool}
					context="people"
					count={v9Selected.size > 0 ? v9Selected.size : v9FilteredContacts.length}
					sourceName="All Contacts"
				/>
			</div>
			<button
				class="btn-primary h-8 gap-1.5 px-3 text-sm"
				onclick={() => toast.show(`Enriching ${v9Selected.size > 0 ? v9Selected.size : v9FilteredContacts.length} contacts…`)}
			>
				<span class="material-icons-round text-sm text-white">auto_awesome</span>
				Enrich
			</button>
		</div>
	</div>

	<!-- Enrichment filter banner -->
	{#if activeRun}
		<div class="border-grey-200 flex items-center gap-3 border-b bg-violet-50/50 px-6 py-2">
			<span class="material-icons-round text-sm text-violet-500">filter_alt</span>
			<span class="text-sm text-violet-700">
				Filtered by enrichment: <span class="font-medium">{activeRun.name}</span>
				<span class="text-violet-400">· {activeRun.contactsCount} contacts · {activeRun.startedAt}</span>
			</span>
			<a
				href="{base}/app/prospects"
				class="ml-auto inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium text-violet-600 hover:bg-violet-100 transition-colors"
			>
				<span class="material-icons-round text-xs">close</span>
				Clear
			</a>
			<button
				class="inline-flex items-center gap-1 rounded-md border border-violet-300 bg-white px-2.5 py-1 text-xs font-medium text-violet-700 hover:bg-violet-50 transition-colors"
				onclick={() => { toast.show(`Saved as list "${activeRun?.name}"`); }}
			>
				<span class="material-icons-round text-xs">bookmark_add</span>
				Save as list
			</button>
		</div>
	{/if}

	<!-- Body: table + right enrichment panel -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Contact table -->
		<div class="flex-1 overflow-auto">
			<table class="w-full min-w-[900px]">
				<thead class="sticky top-0 z-10">
					<tr class="table-header">
						<th class="w-10 px-3 py-3">
							<input
								type="checkbox"
								checked={v9Selected.size === v9FilteredContacts.length && v9FilteredContacts.length > 0}
								onchange={v9ToggleAll}
								class="accent-violet-700"
							/>
						</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
						<th class="w-8 px-1 py-3"></th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">In lists</th>
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each v9FilteredContacts as contact}
						{@const contactLists = v6Store.getListsForContact(contact.id)}
						<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors {v9Selected.has(contact.id) ? 'bg-violet-50/40' : ''}">
							<td class="w-10 px-3 py-3">
								<input
									type="checkbox"
									checked={v9Selected.has(contact.id)}
									onchange={() => v9ToggleContact(contact.id)}
									class="accent-violet-700"
								/>
							</td>
							<td class="px-4 py-3">
								<div>
									<p class="text-grey-900 text-sm font-medium">{contact.firstName} {contact.lastName}</p>
									<p class="text-grey-400 text-xs">{contact.location}</p>
								</div>
							</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{contact.company}</td>
							<td class="text-grey-600 px-4 py-3 text-sm">{contact.title}</td>
							<td class="px-4 py-3">
								{#if contact.email}
									<div class="flex items-center gap-1.5">
										<span class="material-icons-round text-sm text-pink-400">email</span>
										<span class="text-grey-900 font-mono text-xs font-semibold">{contact.email}</span>
										{#if contact.emailStatus === 'valid'}
											<span class="material-icons-round text-sm text-emerald-500">check_circle</span>
										{/if}
									</div>
								{:else}
									<span class="text-grey-300 text-xs">—</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if contact.phone}
									<div class="flex items-center gap-1.5">
										<span class="material-icons-round text-sm text-violet-400">phone</span>
										<span class="text-grey-900 font-mono text-xs">{contact.phone}</span>
									</div>
								{:else}
									<button
										class="flex h-7 items-center gap-1 rounded-lg border border-grey-200 px-2 text-xs font-medium text-grey-500 transition-colors hover:border-violet-300 hover:text-violet-600"
										onclick={() => toast.show(`Finding phone for ${contact.firstName}…`)}
									>
										<span class="material-icons-round text-xs">phone</span>
										Find phone
									</button>
								{/if}
							</td>
							<td class="px-1 py-3">
								<button
									class="flex h-7 w-7 items-center justify-center rounded-lg transition-colors {contact.hubspotSynced ? 'opacity-100' : 'opacity-40 hover:opacity-70'}"
									title={contact.hubspotSynced ? 'Already in HubSpot' : 'Push to HubSpot'}
									onclick={() => toast.show(contact.hubspotSynced ? `${contact.firstName} ${contact.lastName} is already in HubSpot` : `Pushing ${contact.firstName} ${contact.lastName} to HubSpot…`)}
								>
									<svg class="h-3.5 w-3.5" viewBox="0 0 1024 1024">
										<circle cx="512" cy="512" r="512" fill={contact.hubspotSynced ? '#FF7A59' : '#9CA3AF'}/>
										<path d="M623.8 624.94c-38.23 0-69.24-30.67-69.24-68.51s31-68.52 69.24-68.52 69.26 30.67 69.26 68.52-31 68.51-69.26 68.51m20.74-200.42v-61a46.83 46.83 0 0 0 27.33-42.29v-1.41c0-25.78-21.32-46.86-47.35-46.86h-1.43c-26 0-47.35 21.09-47.35 46.86v1.41a46.85 46.85 0 0 0 27.33 42.29v61a135.08 135.08 0 0 0-63.86 27.79l-169.1-130.17A52.49 52.49 0 0 0 372 309c0-29.21-23.89-52.92-53.4-53s-53.45 23.59-53.48 52.81 23.85 52.88 53.36 52.93a53.29 53.29 0 0 0 26.33-7.09l166.38 128.1a132.14 132.14 0 0 0 2.07 150.3l-50.62 50.1A43.42 43.42 0 1 0 450.1 768c24.24 0 43.9-19.46 43.9-43.45a42.24 42.24 0 0 0-2-12.42l50-49.52a135.28 135.28 0 0 0 81.8 27.47c74.61 0 135.06-59.83 135.06-133.65 0-66.82-49.62-122-114.33-131.91" fill="#fff" fill-rule="evenodd"/>
									</svg>
								</button>
							</td>
							<td class="px-4 py-3">
								{#if contactLists.length > 0}
									<div class="flex flex-wrap gap-1">
										{#each contactLists.slice(0, 2) as clist}
											<a
												href="{base}/app/prospects/{clist.id}"
												class="inline-flex items-center gap-1 rounded-full border border-grey-200 bg-grey-50 px-2 py-0.5 text-xs font-medium text-grey-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-colors"
											>
												<span class="material-icons-round text-[10px]">folder</span>
												<span class="max-w-[100px] truncate">{clist.name}</span>
											</a>
										{/each}
										{#if contactLists.length > 2}
											<span class="text-grey-400 text-xs">+{contactLists.length - 2}</span>
										{/if}
									</div>
								{:else}
									<span class="text-grey-300 text-xs">—</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Right panel: Enrichment jobs -->
		<div class="border-grey-200 w-72 shrink-0 border-l bg-white overflow-y-auto">
			<div class="flex items-center justify-between px-5 pt-5 pb-3">
				<p class="text-grey-700 text-xs font-semibold uppercase tracking-wider">Enrichments</p>
				{#if activeRun}
					<a href="{base}/app/prospects" class="text-violet-600 hover:text-violet-700 text-xs font-medium">Show all</a>
				{/if}
			</div>
			<div class="flex flex-col gap-0.5 px-3 pb-4">
				{#each v6Store.runs as run}
					<a
						href="{base}/app/prospects?enrichment={run.id}"
						class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all group
							{activeRun?.id === run.id ? 'border-2 border-violet-400 bg-violet-50/50 shadow-sm' : activeRun ? 'border border-transparent opacity-50 hover:opacity-80' : 'border border-transparent hover:bg-grey-50'}"
					>
						<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg {activeRun?.id === run.id ? 'bg-violet-100' : 'bg-grey-100 group-hover:bg-violet-50'} transition-colors">
							<span class="material-icons-round text-base {activeRun?.id === run.id ? 'text-violet-600' : 'text-grey-500 group-hover:text-violet-600'} transition-colors">{run.inputMethod === 'csv' ? 'description' : run.inputMethod === 'search' ? 'search' : run.inputMethod === 'crm' ? 'hub' : run.inputMethod === 'manual' ? 'edit' : 'bolt'}</span>
						</div>
						<div class="min-w-0 flex-1">
							<p class="text-grey-900 text-sm font-medium truncate group-hover:text-violet-700 transition-colors">{run.name}</p>
							<p class="text-grey-400 text-[10px]">{run.found}/{run.contactsCount} found · {run.startedAt}</p>
						</div>
						{#if run.status === 'running'}
							<div class="flex flex-col items-end gap-0.5 shrink-0">
								<span class="material-icons-round text-violet-500 text-base animate-spin" style="animation-duration: 1.5s;">sync</span>
								<div class="bg-grey-200 h-1.5 w-12 overflow-hidden rounded-full">
									<div class="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600 enrichment-bar" style:width="{run.progress}%"></div>
								</div>
								<span class="text-violet-600 text-[10px] font-bold">{run.progress}%</span>
							</div>
						{:else if run.status === 'completed'}
							<span class="material-icons-round text-emerald-500 text-sm shrink-0">check_circle</span>
						{:else}
							<span class="material-icons-round text-grey-300 text-sm shrink-0">schedule</span>
						{/if}
					</a>
				{/each}
				{#if v6Store.runs.length === 0}
					<p class="text-grey-400 text-xs py-4 px-2">No enrichments yet</p>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- New list modal (V9) -->
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
						<input type="radio" name="v9-list-type" value="people" bind:group={v6NewListType} class="accent-violet-700" />
						People list
					</label>
					<label class="flex cursor-pointer items-center gap-2 text-sm text-grey-800">
						<input type="radio" name="v9-list-type" value="company" bind:group={v6NewListType} class="accent-violet-700" />
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

{:else if version === 'v8'}
<!-- V8: Lists with auto-created provenance -->
<div class="flex h-full flex-col">
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h1 class="text-grey-900 text-base font-semibold">Lists</h1>
			<span class="text-grey-500 text-sm">{v6Lists.length} lists</span>
		</div>
		<div class="flex items-center gap-2">
			<button class="btn-primary h-8 gap-1.5 px-3 text-sm" onclick={() => { v6NewListOpen = true; }}>
				<span class="material-icons-round text-sm text-white">add</span>
				New list
			</button>
		</div>
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
							<input type="radio" name="v8-list-type" value="people" bind:group={v6NewListType} class="accent-violet-700" />
							People list
						</label>
						<label class="flex cursor-pointer items-center gap-2 text-sm text-grey-800">
							<input type="radio" name="v8-list-type" value="company" bind:group={v6NewListType} class="accent-violet-700" />
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
						<td class="px-4 py-3">
							{#if list.type === 'people'}
								<span class="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">People</span>
							{:else}
								<span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Company</span>
							{/if}
						</td>
						<td class="px-4 py-3">
							<div class="flex items-center gap-2">
								<a href="{svelteBase}/{$page.params.version}/app/prospects/{list.id}" class="text-grey-900 text-sm font-medium hover:text-violet-700">{list.name}</a>
								{#if list.autoCreated}
									<span class="inline-flex items-center gap-1 rounded-full border border-dashed border-grey-300 px-1.5 py-0.5 text-[10px] text-grey-400" title="Auto-created from {list.autoCreatedFrom?.name ?? 'enrichment'}">
										<span class="material-icons-round text-[10px]">auto_awesome</span>
										auto
									</span>
								{/if}
							</div>
							{#if list.autoCreated && list.autoCreatedFrom}
								<p class="text-grey-400 mt-0.5 text-xs">
									From {list.autoCreatedFrom.type === 'csv' ? 'CSV' : list.autoCreatedFrom.type === 'search' ? 'Search' : 'Enrichment'}: {list.autoCreatedFrom.name}
								</p>
							{/if}
						</td>
						<td class="text-grey-700 px-4 py-3 text-sm">{list.memberIds.length}</td>
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
						<td class="px-4 py-3">
							<div class="flex flex-wrap gap-1">
								{#each list.sources as src}
									{#if v6SourceBadge[src]}
										<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {v6SourceBadge[src].color}">{v6SourceBadge[src].label}</span>
									{/if}
								{/each}
							</div>
						</td>
						<td class="text-grey-700 px-4 py-3 text-sm">{list.owner}</td>
						<td class="text-grey-500 px-4 py-3 text-sm">{list.updatedAt}</td>
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


<style>
	@keyframes shimmer {
		0% { background-position: -200% 0; }
		100% { background-position: 200% 0; }
	}
	:global(.enrichment-bar) {
		background-size: 200% 100%;
		background-image: linear-gradient(90deg, #8b5cf6 0%, #c4b5fd 50%, #8b5cf6 100%);
		animation: shimmer 2s ease-in-out infinite;
	}
</style>
