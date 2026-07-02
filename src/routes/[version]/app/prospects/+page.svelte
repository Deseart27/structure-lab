<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';

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
