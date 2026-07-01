<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';

	let base = $derived(`${svelteBase}/${$page.params.version}`);
	let listId = $derived($page.params.listId);

	const listsData: Record<string, { name: string; source: string }> = {
		'1': { name: 'SaaS Founders Q1', source: 'search' },
		'2': { name: 'VP Sales Software', source: 'search' },
		'3': { name: 'Series B Startups', source: 'csv' },
		'4': { name: 'European Marketing Leads', source: 'csv' },
		'5': { name: 'Agency Owners USA', source: 'manual' },
		'6': { name: 'Newsletter Reverse Lookup', source: 'reverse' },
		'7': { name: 'Clay Workflow Import', source: 'api' },
		'8': { name: 'Claude MCP Batch', source: 'mcp' },
	};

	let currentList = $derived(listsData[listId] ?? { name: `List #${listId}`, source: 'search' });

	const contacts = [
		{ id: '1', name: 'Sarah Chen', title: 'VP of Sales', company: 'Stripe', location: 'San Francisco, US', source: 'search', status: 'enriched', phone: '+1 415 555 0101', email: 'sarah.chen@stripe.com', emailStatus: 'valid', crmSynced: true },
		{ id: '2', name: 'James Rodriguez', title: 'Head of Marketing', company: 'HubSpot', location: 'Boston, US', source: 'search', status: 'enriched', phone: '+1 617 555 0202', email: 'james.r@hubspot.com', emailStatus: 'valid', crmSynced: true },
		{ id: '3', name: 'Emma Dubois', title: 'CTO', company: 'Datadog', location: 'Paris, France', source: 'csv', status: 'enriched', phone: '+33 1 55 03 03', email: 'emma.d@datadoghq.com', emailStatus: 'valid', crmSynced: false },
		{ id: '4', name: 'Michael Park', title: 'Director of Engineering', company: 'Notion', location: 'New York, US', source: 'manual', status: 'enriched', phone: '', email: 'michael.p@notion.so', emailStatus: 'valid', crmSynced: false },
		{ id: '5', name: 'Laura Bianchi', title: 'CEO', company: 'Factorial', location: 'Barcelona, Spain', source: 'search', status: 'enriched', phone: '+34 93 555 0505', email: 'laura@factorial.co', emailStatus: 'catch-all', crmSynced: true },
		{ id: '6', name: 'David Kim', title: 'VP of Product', company: 'Figma', location: 'San Francisco, US', source: 'search', status: 'pending', phone: '', email: '', emailStatus: 'pending', crmSynced: false },
		{ id: '7', name: 'Sophie Martin', title: 'Sales Director', company: 'Aircall', location: 'Paris, France', source: 'reverse', status: 'enriched', phone: '+33 1 55 07 07', email: 'sophie.m@aircall.io', emailStatus: 'valid', crmSynced: true },
		{ id: '8', name: 'Alex Thompson', title: 'Head of Growth', company: 'Loom', location: 'San Francisco, US', source: 'api', status: 'enriched', phone: '', email: 'alex.t@loom.com', emailStatus: 'invalid', crmSynced: false },
		{ id: '9', name: 'Maria Garcia', title: 'CMO', company: 'Typeform', location: 'Barcelona, Spain', source: 'search', status: 'enriched', phone: '+34 93 555 0909', email: 'maria.g@typeform.com', emailStatus: 'valid', crmSynced: false },
		{ id: '10', name: 'Thomas Weber', title: 'VP Engineering', company: 'Personio', location: 'Munich, Germany', source: 'csv', status: 'enriched', phone: '+49 89 555 1010', email: 'thomas.w@personio.de', emailStatus: 'valid', crmSynced: true },
	];

	const sourceLabels: Record<string, { label: string; icon: string; color: string }> = {
		search: { label: 'Search', icon: 'search', color: 'text-blue-600 bg-blue-50' },
		csv: { label: 'CSV', icon: 'upload_file', color: 'text-orange-600 bg-orange-50' },
		manual: { label: 'Manual', icon: 'edit', color: 'text-violet-600 bg-violet-50' },
		reverse: { label: 'Reverse', icon: 'person_search', color: 'text-emerald-600 bg-emerald-50' },
		api: { label: 'API', icon: 'api', color: 'text-pink-600 bg-pink-50' },
		mcp: { label: 'MCP', icon: 'smart_toy', color: 'text-indigo-600 bg-indigo-50' },
	};

	const emailStatusLabels: Record<string, { label: string; color: string }> = {
		valid: { label: 'Valid', color: 'text-emerald-700 bg-emerald-50' },
		invalid: { label: 'Invalid', color: 'text-red-700 bg-red-50' },
		'catch-all': { label: 'Catch-all', color: 'text-amber-700 bg-amber-50' },
		pending: { label: 'Pending', color: 'text-grey-600 bg-grey-100' },
	};

	let selectedContacts: Set<string> = $state(new Set());

	function toggleContact(id: string) {
		const next = new Set(selectedContacts);
		if (next.has(id)) next.delete(id);
		else next.add(id);
		selectedContacts = next;
	}

	function toggleAll() {
		if (selectedContacts.size === contacts.length) {
			selectedContacts = new Set();
		} else {
			selectedContacts = new Set(contacts.map((c) => c.id));
		}
	}
</script>

<div class="flex h-full flex-col">
	<!-- Header with back nav -->
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<a href="{base}/app/prospects" class="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg p-0">
				<span class="material-icons-round text-grey-600 text-lg">arrow_back</span>
			</a>
			<h1 class="text-grey-900 text-base font-semibold">{currentList.name}</h1>
			<span class="text-grey-500 text-sm">{contacts.length} contacts</span>
			<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium {sourceLabels[currentList.source].color}">
				<span class="material-icons-round text-xs">{sourceLabels[currentList.source].icon}</span>
				{sourceLabels[currentList.source].label}
			</span>
		</div>
		<div class="flex items-center gap-2">
			{#if selectedContacts.size > 0}
				<span class="text-grey-600 mr-1 text-sm">{selectedContacts.size} selected</span>
			{/if}
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Enrichment started')}>
				<span class="material-icons-round text-grey-600 text-base">auto_awesome</span>
				Enrich
			</button>
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Reverse enrichment started')}>
				<span class="material-icons-round text-grey-600 text-base">person_search</span>
				Reverse Enrich
			</button>
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Export started — CSV will download shortly')}>
				<span class="material-icons-round text-grey-600 text-base">download</span>
				Export
			</button>
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" style="color: #ff7a59;" onclick={() => toast.show('Contacts pushed to HubSpot')}>
				<span class="material-icons-round text-base">hub</span>
				Push to HubSpot
			</button>
		</div>
	</div>

	<!-- Table -->
	<div class="flex-1 overflow-auto">
		<table class="w-full min-w-[1100px]">
			<thead class="bg-grey-50 sticky top-0 z-10">
				<tr class="border-grey-200 border-b">
					<th class="w-12 px-4 py-3">
						<input type="checkbox" checked={selectedContacts.size === contacts.length} onchange={toggleAll} />
					</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Contact</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email status</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Source</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">CRM</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
				</tr>
			</thead>
			<tbody class="bg-white">
				{#each contacts as contact}
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
							{#if contact.email}
								<span class="text-grey-900 font-mono text-xs">{contact.email}</span>
							{:else}
								<span class="text-grey-300 text-xs">—</span>
							{/if}
						</td>
						<td class="px-4 py-3">
							{#if contact.emailStatus !== 'pending' && contact.email}
								<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {emailStatusLabels[contact.emailStatus].color}">
									{emailStatusLabels[contact.emailStatus].label}
								</span>
							{:else}
								<span class="text-grey-300 text-xs">—</span>
							{/if}
						</td>
						<td class="px-4 py-3">
							<span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium {sourceLabels[contact.source].color}">
								<span class="material-icons-round text-xs">{sourceLabels[contact.source].icon}</span>
								{sourceLabels[contact.source].label}
							</span>
						</td>
						<td class="px-4 py-3">
							{#if contact.crmSynced}
								<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
									<span class="material-icons-round text-xs">check_circle</span>
									Synced
								</span>
							{:else}
								<span class="text-grey-400 text-xs">—</span>
							{/if}
						</td>
						<td class="px-4 py-3">
							{#if contact.status === 'enriched'}
								<span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Enriched</span>
							{:else}
								<span class="inline-flex items-center rounded-full bg-grey-100 px-2 py-0.5 text-xs font-medium text-grey-600">Pending</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
