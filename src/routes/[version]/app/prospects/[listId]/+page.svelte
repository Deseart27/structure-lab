<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';
	import { v6Store } from '$lib/mock/v6.svelte';
	import ExportPopover from '$lib/components/ExportPopover.svelte';

	let base = $derived(`${svelteBase}/${$page.params.version}`);
	let version = $derived($page.params.version);
	let listId = $derived($page.params.listId);

	// V6 derived state
	let v6List = $derived(v6Store.getList(listId));
	let v6Contacts = $derived(v6List && v6List.type === 'people' ? v6Store.getContactsForList(v6List) : []);
	let v6Companies = $derived(
		v6List && v6List.type === 'company'
			? v6List.memberIds.map(id => v6Store.companies.find(c => c.id === id)).filter(Boolean)
			: []
	);
	let v6ExportOpen = $state(false);

	// V7 derived state
	let v7List = $derived(v6Store.getList(listId));
	let v7Contacts = $derived(v7List && v7List.type === 'people' ? v6Store.getContactsForList(v7List) : []);
	let v7Companies = $derived(
		v7List && v7List.type === 'company'
			? v7List.memberIds.map(id => v6Store.companies.find(c => c.id === id)).filter(Boolean)
			: []
	);
	let v7ListRuns = $derived(v7List ? v6Store.getRunsForList(v7List.id) : []);
	let v7ActiveRun = $derived(v7ListRuns.find(r => r.status === 'running'));

	// V8 derived state
	let v8List = $derived(v6Store.getList(listId));
	let v8Contacts = $derived(v8List && v8List.type === 'people' ? v6Store.getContactsForList(v8List) : []);
	let v8Companies = $derived(
		v8List && v8List.type === 'company'
			? v8List.memberIds.map(id => v6Store.companies.find(c => c.id === id)).filter(Boolean)
			: []
	);
	let v8ListRuns = $derived(v8List ? v6Store.getRunsForList(v8List.id) : []);
	let v8ActiveRun = $derived(v8ListRuns.find(r => r.status === 'running'));

	// V9: selected enrichment run for filtering
	let v9SelectedRun = $state<string | null>(null);

	const emailStatusStyles: Record<string, { label: string; color: string }> = {
		valid:          { label: 'Valid',         color: 'text-emerald-700 bg-emerald-50' },
		'catch-all':    { label: 'Catch-all',     color: 'text-amber-700 bg-amber-50' },
		'invalid-found':{ label: 'Invalid',       color: 'text-red-700 bg-red-50' },
		'not-found':    { label: 'Not found',     color: 'text-grey-500 bg-grey-100' },
		pending:        { label: 'Pending',        color: 'text-grey-500 bg-grey-100' },
	};

	function v6GetJobProvenance(contactId: string): { name: string; id: string } | null {
		for (const job of v6Store.jobs) {
			if (job.contacts.some(c => c.id === contactId)) {
				return { name: job.name, id: job.id };
			}
		}
		return null;
	}

	const listsData: Record<string, string> = {
		'1': 'SaaS Founders Q1',
		'2': 'VP Sales Software',
		'3': 'Series B Startups',
		'4': 'European Marketing Leads',
		'5': 'Agency Owners USA',
		'6': 'Newsletter Reverse Lookup',
		'7': 'Clay Workflow Import',
		'8': 'Claude MCP Batch',
	};

	let listName = $derived(listsData[listId] ?? `List #${listId}`);

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

{#if version === 'v6' && v6List}
<!-- V6 List Detail -->
<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<a href="{base}/app/prospects" class="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg p-0">
				<span class="material-icons-round text-grey-600 text-lg">arrow_back</span>
			</a>
			<h1 class="text-grey-900 text-base font-semibold">{v6List.name}</h1>
			{#if v6List.type === 'people'}
				<span class="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">People</span>
				<span class="text-grey-500 text-sm">{v6Contacts.length} contacts</span>
			{:else}
				<span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Company</span>
				<span class="text-grey-500 text-sm">{v6Companies.length} companies</span>
			{/if}
		</div>
		<div class="flex items-center gap-2">
			{#if v6List.type === 'people'}
				<button
					class="btn-ghost h-8 gap-1.5 px-3 text-sm"
					onclick={() => toast.show(`Enrichment started for "${v6List.name}" — results will flow back into the list`)}
				>
					<span class="material-icons-round text-grey-600 text-base">auto_awesome</span>
					Enrich
				</button>
			{/if}
			<div class="relative">
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => { v6ExportOpen = !v6ExportOpen; }}>
					<span class="material-icons-round text-grey-600 text-base">download</span>
					Export
					<span class="material-icons-round text-grey-400 text-sm">expand_more</span>
				</button>
				<ExportPopover
					bind:open={v6ExportOpen}
					context={v6List.type === 'people' ? 'people' : 'companies'}
					count={v6List.memberIds.length}
					sourceName={v6List.name}
				/>
			</div>
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Add contacts — coming soon')}>
				<span class="material-icons-round text-grey-600 text-base">person_add</span>
				Add contacts
			</button>
		</div>
	</div>

	<!-- Content -->
	<div class="flex-1 overflow-auto">
		{#if v6List.type === 'people'}
			<!-- People list table -->
			<table class="w-full min-w-[1000px]">
				<thead class="sticky top-0 z-10">
					<tr class="table-header">
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email status</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">In job</th>
						<th class="w-12 px-4 py-3"></th>
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each v6Contacts as contact}
						{@const job = v6GetJobProvenance(contact.id)}
						<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
							<td class="px-4 py-3">
								<p class="text-grey-900 text-sm font-medium">{contact.firstName} {contact.lastName}</p>
							</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{contact.company}</td>
							<td class="text-grey-600 px-4 py-3 text-sm">{contact.title}</td>
							<td class="px-4 py-3">
								{#if contact.email}
									<span class="text-grey-900 font-mono text-xs">{contact.email}</span>
								{:else}
									<span class="text-grey-300 text-xs">—</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if contact.phone}
									<span class="text-grey-900 font-mono text-xs">{contact.phone}</span>
								{:else}
									<span class="text-grey-300 text-xs">—</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if emailStatusStyles[contact.emailStatus]}
									<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {emailStatusStyles[contact.emailStatus].color}">
										{emailStatusStyles[contact.emailStatus].label}
									</span>
								{:else}
									<span class="text-grey-300 text-xs">—</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if job}
									<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-xs font-medium text-grey-600" title={job.name}>
										<span class="material-icons-round text-xs">work_outline</span>
										{job.name.length > 20 ? job.name.slice(0, 20) + '…' : job.name}
									</span>
								{:else}
									<span class="text-grey-300 text-xs">—</span>
								{/if}
							</td>
							<td class="px-4 py-3 text-right">
								<button
									class="btn-ghost h-7 w-7 p-0"
									title="Remove from list"
									onclick={() => toast.show(`${contact.firstName} ${contact.lastName} removed from list`)}
								>
									<span class="material-icons-round text-grey-400 text-base">close</span>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<!-- Company list table -->
			<table class="w-full min-w-[800px]">
				<thead class="sticky top-0 z-10">
					<tr class="table-header">
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Industry</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Headcount</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Funding</th>
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each v6Companies as company}
						{#if company}
							<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
								<td class="px-4 py-3">
									<a
										href="{base}/app/search/companies/{company.id}"
										class="text-grey-900 text-sm font-medium hover:text-violet-700"
									>{company.name}</a>
								</td>
								<td class="text-grey-700 px-4 py-3 text-sm">{company.industry}</td>
								<td class="text-grey-700 px-4 py-3 text-sm">{company.headcount.toLocaleString()}</td>
								<td class="text-grey-700 px-4 py-3 text-sm">{company.location}</td>
								<td class="px-4 py-3">
									{#if company.fundingUnlocked && company.funding}
										<span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
											{company.funding.round} · ${company.funding.amount}
										</span>
									{:else}
										<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-xs font-medium text-grey-500">
											<span class="material-icons-round text-xs">lock</span>
											Locked
										</span>
									{/if}
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>

{:else if version === 'v6' && !v6List}
<div class="flex h-full items-center justify-center">
	<p class="text-grey-400 text-sm">List not found.</p>
</div>

{:else if version === 'v7' && v7List}
<!-- V7 List Detail — enrichment lives here -->
<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<a href="{base}/app/prospects" class="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg p-0">
				<span class="material-icons-round text-grey-600 text-lg">arrow_back</span>
			</a>
			<h1 class="text-grey-900 text-base font-semibold">{v7List.name}</h1>
			{#if v7List.type === 'people'}
				<span class="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">People</span>
				<span class="text-grey-500 text-sm">{v7Contacts.length} contacts</span>
			{:else}
				<span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Company</span>
				<span class="text-grey-500 text-sm">{v7Companies.length} companies</span>
			{/if}
			{#if v7ActiveRun}
				<span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
					<span class="material-icons-round text-xs animate-spin" style="animation-duration:1.5s">sync</span>
					Enriching {v7ActiveRun.progress}%
				</span>
			{/if}
		</div>
		<div class="flex items-center gap-2">
			{#if v7List.type === 'people'}
				<a
					href="{base}/app/enrich"
					class="btn-ghost h-8 gap-1.5 px-3 text-sm"
				>
					<span class="material-icons-round text-violet-600 text-base">auto_awesome</span>
					Enrich
				</a>
			{/if}
			<div class="relative">
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => { v6ExportOpen = !v6ExportOpen; }}>
					<span class="material-icons-round text-grey-600 text-base">download</span>
					Export
					<span class="material-icons-round text-grey-400 text-sm">expand_more</span>
				</button>
				<ExportPopover
					bind:open={v6ExportOpen}
					context={v7List.type === 'people' ? 'people' : 'companies'}
					count={v7List.memberIds.length}
					sourceName={v7List.name}
				/>
			</div>
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Add contacts — coming soon')}>
				<span class="material-icons-round text-grey-600 text-base">person_add</span>
				Add contacts
			</button>
		</div>
	</div>

	<!-- Content -->
	<div class="flex-1 overflow-auto">
		<!-- Enrichment activity banner (if runs exist) -->
		{#if v7ListRuns.length > 0}
			<div class="border-b border-grey-100 bg-grey-50/50 px-6 py-3">
				<div class="flex items-center justify-between mb-2">
					<p class="text-grey-700 text-xs font-semibold uppercase tracking-wider">Enrichment activity</p>
					<span class="text-grey-400 text-xs">{v7ListRuns.length} run{v7ListRuns.length > 1 ? 's' : ''}</span>
				</div>
				<div class="flex flex-col gap-1.5">
					{#each v7ListRuns.slice(0, 3) as run}
						<div class="flex items-center gap-3 rounded-lg bg-white px-3 py-2 border border-grey-100">
							<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md
								{run.outputType === 'emails' ? 'bg-violet-50' : run.outputType === 'phones' ? 'bg-blue-50' : run.outputType === 'reverse' ? 'bg-teal-50' : 'bg-amber-50'}">
								<span class="material-icons-round text-xs
									{run.outputType === 'emails' ? 'text-violet-600' : run.outputType === 'phones' ? 'text-blue-600' : run.outputType === 'reverse' ? 'text-teal-600' : 'text-amber-600'}">
									{run.outputType === 'emails' ? 'email' : run.outputType === 'phones' ? 'phone' : run.outputType === 'reverse' ? 'swap_horiz' : 'auto_awesome'}
								</span>
							</div>
							<span class="text-grey-800 text-xs font-medium flex-1">
								{run.outputType === 'emails' ? 'Find Emails' : run.outputType === 'phones' ? 'Find Phones' : run.outputType === 'reverse' ? 'Reverse Enrich' : 'Full Enrichment'}
								<span class="text-grey-400 font-normal"> · {run.found}/{run.contactsCount} found</span>
							</span>
							{#if run.status === 'running'}
								<div class="flex items-center gap-1.5">
									<div class="bg-grey-200 h-1 w-12 overflow-hidden rounded-full">
										<div class="h-full rounded-full bg-amber-400" style:width="{run.progress}%"></div>
									</div>
									<span class="text-amber-700 text-xs font-medium">{run.progress}%</span>
								</div>
							{:else if run.status === 'queued'}
								<span class="text-grey-400 text-xs">Queued</span>
							{:else}
								<span class="text-emerald-600 text-xs font-medium">Done</span>
							{/if}
							<span class="text-grey-400 text-xs">{run.startedAt}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if v7List.type === 'people'}
			<!-- People list table -->
			<table class="w-full min-w-[1000px]">
				<thead class="sticky top-0 z-10">
					<tr class="table-header">
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email status</th>
						<th class="w-12 px-4 py-3"></th>
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each v7Contacts as contact}
						<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
							<td class="px-4 py-3">
								<p class="text-grey-900 text-sm font-medium">{contact.firstName} {contact.lastName}</p>
							</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{contact.company}</td>
							<td class="text-grey-600 px-4 py-3 text-sm">{contact.title}</td>
							<td class="px-4 py-3">
								{#if contact.email}
									<span class="text-grey-900 font-mono text-xs">{contact.email}</span>
								{:else}
									<span class="text-grey-300 text-xs">—</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if contact.phone}
									<span class="text-grey-900 font-mono text-xs">{contact.phone}</span>
								{:else}
									<span class="text-grey-300 text-xs">—</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if emailStatusStyles[contact.emailStatus]}
									<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {emailStatusStyles[contact.emailStatus].color}">
										{emailStatusStyles[contact.emailStatus].label}
									</span>
								{:else}
									<span class="text-grey-300 text-xs">—</span>
								{/if}
							</td>
							<td class="px-4 py-3 text-right">
								<button
									class="btn-ghost h-7 w-7 p-0"
									title="Remove from list"
									onclick={() => toast.show(`${contact.firstName} ${contact.lastName} removed from list`)}
								>
									<span class="material-icons-round text-grey-400 text-base">close</span>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<!-- Company list table -->
			<table class="w-full min-w-[800px]">
				<thead class="sticky top-0 z-10">
					<tr class="table-header">
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Industry</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Headcount</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Funding</th>
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each v7Companies as company}
						{#if company}
							<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
								<td class="px-4 py-3">
									<a
										href="{base}/app/search/companies/{company.id}"
										class="text-grey-900 text-sm font-medium hover:text-violet-700"
									>{company.name}</a>
								</td>
								<td class="text-grey-700 px-4 py-3 text-sm">{company.industry}</td>
								<td class="text-grey-700 px-4 py-3 text-sm">{company.headcount.toLocaleString()}</td>
								<td class="text-grey-700 px-4 py-3 text-sm">{company.location}</td>
								<td class="px-4 py-3">
									{#if company.fundingUnlocked && company.funding}
										<span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
											{company.funding.round} · ${company.funding.amount}
										</span>
									{:else}
										<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-xs font-medium text-grey-500">
											<span class="material-icons-round text-xs">lock</span>
											Locked
										</span>
									{/if}
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>

{:else if version === 'v7' && !v7List}
<div class="flex h-full items-center justify-center">
	<p class="text-grey-400 text-sm">List not found.</p>
</div>

{:else if version === 'v9' && v8List}
<!-- V9 List Detail — side panel with donut charts + enrichment timeline -->
{@const emailStats = (() => {
	const stats = { valid: 0, catchAll: 0, invalid: 0, notFound: 0, pending: 0, total: v8Contacts.length };
	for (const c of v8Contacts) {
		if (c.emailStatus === 'valid') stats.valid++;
		else if (c.emailStatus === 'catch-all') stats.catchAll++;
		else if (c.emailStatus === 'invalid-found') stats.invalid++;
		else if (c.emailStatus === 'not-found') stats.notFound++;
		else stats.pending++;
	}
	return stats;
})()}
{@const phoneStats = (() => {
	const found = v8Contacts.filter(c => c.phone).length;
	return { found, notFound: v8Contacts.length - found, total: v8Contacts.length };
})()}
<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<a href="{base}/app/prospects" class="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg p-0">
				<span class="material-icons-round text-grey-600 text-lg">arrow_back</span>
			</a>
			<h1 class="text-grey-900 text-base font-semibold">{v8List.name}</h1>
			{#if v8List.autoCreated}
				<span class="inline-flex items-center gap-1 rounded-full border border-dashed border-grey-300 px-1.5 py-0.5 text-[10px] text-grey-400">
					<span class="material-icons-round text-[10px]">auto_awesome</span>
					auto
				</span>
			{/if}
			{#if v8List.type === 'people'}
				<span class="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">People</span>
				<span class="text-grey-500 text-sm">{v8Contacts.length} contacts</span>
			{:else}
				<span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Company</span>
				<span class="text-grey-500 text-sm">{v8Companies.length} companies</span>
			{/if}
			{#if v8ActiveRun}
				<span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
					<span class="material-icons-round text-xs animate-spin" style="animation-duration:1.5s">sync</span>
					Enriching {v8ActiveRun.progress}%
				</span>
			{/if}
		</div>
		<div class="flex items-center gap-2">
			{#if v8List.type === 'people'}
				<a href="{base}/app/enrich" class="btn-ghost h-8 gap-1.5 px-3 text-sm">
					<span class="material-icons-round text-violet-600 text-base">auto_awesome</span>
					Enrich
				</a>
			{/if}
			<div class="relative">
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => { v6ExportOpen = !v6ExportOpen; }}>
					<span class="material-icons-round text-grey-600 text-base">download</span>
					Export
					<span class="material-icons-round text-grey-400 text-sm">expand_more</span>
				</button>
				<ExportPopover
					bind:open={v6ExportOpen}
					context={v8List.type === 'people' ? 'people' : 'companies'}
					count={v8List.memberIds.length}
					sourceName={v8List.name}
				/>
			</div>
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Add contacts — coming soon')}>
				<span class="material-icons-round text-grey-600 text-base">person_add</span>
				Add contacts
			</button>
		</div>
	</div>

	<!-- Body: table + side panel -->
	<div class="flex flex-1 overflow-hidden">
		<!-- Contact table -->
		<div class="flex-1 overflow-auto">
			{#if v8List.autoCreated && v8List.autoCreatedFrom}
				<div class="border-b border-grey-100 bg-grey-50/50 px-6 py-2.5">
					<div class="flex items-center gap-2 text-xs text-grey-500">
						<span class="material-icons-round text-sm text-grey-400">info</span>
						Auto-created from
						<span class="font-medium text-grey-700">{v8List.autoCreatedFrom.type === 'csv' ? 'CSV' : v8List.autoCreatedFrom.type === 'search' ? 'Search' : 'Enrichment'}: {v8List.autoCreatedFrom.name}</span>
						<span class="text-grey-300">·</span>
						<button class="text-violet-600 hover:text-violet-700 font-medium" onclick={() => toast.show('List is now a regular list')}>Make permanent</button>
					</div>
				</div>
			{/if}

			{#if v8List.type === 'people'}
				<table class="w-full min-w-[800px]">
					<thead class="sticky top-0 z-10">
						<tr class="table-header">
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email status</th>
							<th class="w-12 px-4 py-3"></th>
						</tr>
					</thead>
					<tbody class="bg-white">
						{#each v9SelectedRun ? v8Contacts.filter(c => { const run = v6Store.getLastRunForContact(c.id); return run && run.id === v9SelectedRun; }) : v8Contacts as contact}
							<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
								<td class="px-4 py-3">
									<p class="text-grey-900 text-sm font-medium">{contact.firstName} {contact.lastName}</p>
								</td>
								<td class="text-grey-700 px-4 py-3 text-sm">{contact.company}</td>
								<td class="text-grey-600 px-4 py-3 text-sm">{contact.title}</td>
								<td class="px-4 py-3">
									{#if contact.email}
										<span class="text-grey-900 font-mono text-xs">{contact.email}</span>
									{:else}
										<span class="text-grey-300 text-xs">—</span>
									{/if}
								</td>
								<td class="px-4 py-3">
									{#if contact.phone}
										<span class="text-grey-900 font-mono text-xs">{contact.phone}</span>
									{:else}
										<span class="text-grey-300 text-xs">—</span>
									{/if}
								</td>
								<td class="px-4 py-3">
									{#if emailStatusStyles[contact.emailStatus]}
										<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {emailStatusStyles[contact.emailStatus].color}">
											{emailStatusStyles[contact.emailStatus].label}
										</span>
									{:else}
										<span class="text-grey-300 text-xs">—</span>
									{/if}
								</td>
								<td class="px-4 py-3 text-right">
									<button
										class="btn-ghost h-7 w-7 p-0"
										title="Remove from list"
										onclick={() => toast.show(`${contact.firstName} ${contact.lastName} removed from list`)}
									>
										<span class="material-icons-round text-grey-400 text-base">close</span>
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<table class="w-full min-w-[700px]">
					<thead class="sticky top-0 z-10">
						<tr class="table-header">
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Industry</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Headcount</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Funding</th>
						</tr>
					</thead>
					<tbody class="bg-white">
						{#each v8Companies as company}
							{#if company}
								<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
									<td class="px-4 py-3">
										<a href="{base}/app/search/companies/{company.id}" class="text-grey-900 text-sm font-medium hover:text-violet-700">{company.name}</a>
									</td>
									<td class="text-grey-700 px-4 py-3 text-sm">{company.industry}</td>
									<td class="text-grey-700 px-4 py-3 text-sm">{company.headcount.toLocaleString()}</td>
									<td class="text-grey-700 px-4 py-3 text-sm">{company.location}</td>
									<td class="px-4 py-3">
										{#if company.fundingUnlocked && company.funding}
											<span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
												{company.funding.round} · ${company.funding.amount}
											</span>
										{:else}
											<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-xs font-medium text-grey-500">
												<span class="material-icons-round text-xs">lock</span>
												Locked
											</span>
										{/if}
									</td>
								</tr>
							{/if}
						{/each}
					</tbody>
				</table>
			{/if}
		</div>

		<!-- Right side panel -->
		{#if v8List.type === 'people'}
		<div class="border-grey-200 w-72 shrink-0 border-l bg-white overflow-y-auto">
			<!-- Email donut -->
			<div class="border-b border-grey-100 px-5 py-5">
				<p class="text-grey-700 mb-3 text-xs font-semibold uppercase tracking-wider">Email results</p>
				<div class="flex items-center gap-4">
					<svg viewBox="0 0 36 36" class="h-16 w-16 shrink-0">
						<circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" stroke-width="3" />
						<circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" stroke-width="3"
							stroke-dasharray="{emailStats.valid / (emailStats.total || 1) * 100} {100 - emailStats.valid / (emailStats.total || 1) * 100}" stroke-dashoffset="25" stroke-linecap="round" />
						<circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" stroke-width="3"
							stroke-dasharray="{emailStats.catchAll / (emailStats.total || 1) * 100} {100 - emailStats.catchAll / (emailStats.total || 1) * 100}" stroke-dashoffset="{25 - emailStats.valid / (emailStats.total || 1) * 100}" stroke-linecap="round" />
						<circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" stroke-width="3"
							stroke-dasharray="{emailStats.invalid / (emailStats.total || 1) * 100} {100 - emailStats.invalid / (emailStats.total || 1) * 100}" stroke-dashoffset="{25 - emailStats.valid / (emailStats.total || 1) * 100 - emailStats.catchAll / (emailStats.total || 1) * 100}" stroke-linecap="round" />
						<text x="18" y="18.5" text-anchor="middle" dominant-baseline="middle" class="fill-grey-900 text-[7px] font-bold">{emailStats.valid + emailStats.catchAll}</text>
						<text x="18" y="23" text-anchor="middle" dominant-baseline="middle" class="fill-grey-400 text-[4px]">found</text>
					</svg>
					<div class="flex flex-col gap-1 text-xs">
						<div class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-emerald-500"></span><span class="text-grey-600">Valid</span><span class="text-grey-900 ml-auto font-medium">{emailStats.valid}</span></div>
						<div class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-amber-500"></span><span class="text-grey-600">Catch-all</span><span class="text-grey-900 ml-auto font-medium">{emailStats.catchAll}</span></div>
						<div class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-red-500"></span><span class="text-grey-600">Invalid</span><span class="text-grey-900 ml-auto font-medium">{emailStats.invalid}</span></div>
						<div class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-grey-300"></span><span class="text-grey-600">Not found</span><span class="text-grey-900 ml-auto font-medium">{emailStats.notFound}</span></div>
					</div>
				</div>
			</div>

			<!-- Phone donut -->
			<div class="border-b border-grey-100 px-5 py-5">
				<p class="text-grey-700 mb-3 text-xs font-semibold uppercase tracking-wider">Phone results</p>
				<div class="flex items-center gap-4">
					<svg viewBox="0 0 36 36" class="h-16 w-16 shrink-0">
						<circle cx="18" cy="18" r="15.915" fill="none" stroke="#f3f4f6" stroke-width="3" />
						<circle cx="18" cy="18" r="15.915" fill="none" stroke="#3b82f6" stroke-width="3"
							stroke-dasharray="{phoneStats.found / (phoneStats.total || 1) * 100} {100 - phoneStats.found / (phoneStats.total || 1) * 100}" stroke-dashoffset="25" stroke-linecap="round" />
						<text x="18" y="18.5" text-anchor="middle" dominant-baseline="middle" class="fill-grey-900 text-[7px] font-bold">{phoneStats.found}</text>
						<text x="18" y="23" text-anchor="middle" dominant-baseline="middle" class="fill-grey-400 text-[4px]">found</text>
					</svg>
					<div class="flex flex-col gap-1 text-xs">
						<div class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-blue-500"></span><span class="text-grey-600">Found</span><span class="text-grey-900 ml-auto font-medium">{phoneStats.found}</span></div>
						<div class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-grey-300"></span><span class="text-grey-600">Not found</span><span class="text-grey-900 ml-auto font-medium">{phoneStats.notFound}</span></div>
					</div>
				</div>
			</div>

			<!-- Enrichment timeline -->
			<div class="px-5 py-5">
				<div class="flex items-center justify-between mb-3">
					<p class="text-grey-700 text-xs font-semibold uppercase tracking-wider">Enrichments</p>
					{#if v9SelectedRun}
						<button class="text-violet-600 hover:text-violet-700 text-xs font-medium" onclick={() => { v9SelectedRun = null; }}>Show all</button>
					{/if}
				</div>
				<div class="flex flex-col gap-2">
					{#each v8ListRuns as run}
						<button
							class="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition-all
								{v9SelectedRun === run.id ? 'border-2 border-violet-400 bg-violet-50/50 shadow-sm' : v9SelectedRun ? 'border border-grey-100 bg-white opacity-50' : 'border border-grey-100 bg-white hover:border-grey-200 hover:bg-grey-50'}"
							onclick={() => { v9SelectedRun = v9SelectedRun === run.id ? null : run.id; }}
						>
							<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md
								{run.outputType === 'emails' ? 'bg-violet-50' : run.outputType === 'phones' ? 'bg-blue-50' : run.outputType === 'reverse' ? 'bg-teal-50' : 'bg-amber-50'}">
								<span class="material-icons-round text-sm
									{run.outputType === 'emails' ? 'text-violet-600' : run.outputType === 'phones' ? 'text-blue-600' : run.outputType === 'reverse' ? 'text-teal-600' : 'text-amber-600'}">
									{run.outputType === 'emails' ? 'email' : run.outputType === 'phones' ? 'phone' : run.outputType === 'reverse' ? 'swap_horiz' : 'auto_awesome'}
								</span>
							</div>
							<div class="min-w-0 flex-1">
								<p class="text-grey-800 text-xs font-medium truncate">
									{run.outputType === 'emails' ? 'Find Emails' : run.outputType === 'phones' ? 'Find Phones' : run.outputType === 'reverse' ? 'Reverse' : 'CRM'}
								</p>
								<p class="text-grey-400 text-[10px]">{run.found}/{run.contactsCount} found · {run.startedAt}</p>
							</div>
							{#if run.status === 'running'}
								<span class="text-amber-600 text-[10px] font-semibold">{run.progress}%</span>
							{:else if run.status === 'completed'}
								<span class="material-icons-round text-emerald-500 text-sm">check_circle</span>
							{:else}
								<span class="material-icons-round text-grey-300 text-sm">schedule</span>
							{/if}
						</button>
					{/each}
					{#if v8ListRuns.length === 0}
						<p class="text-grey-400 text-xs py-2">No enrichments yet</p>
					{/if}
				</div>
			</div>
		</div>
		{/if}
	</div>
</div>

{:else if version === 'v9' && !v8List}
<div class="flex h-full items-center justify-center">
	<p class="text-grey-400 text-sm">List not found.</p>
</div>

{:else if version === 'v8' && v8List}
<!-- V8 List Detail — with auto-created provenance -->
<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<a href="{base}/app/prospects" class="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg p-0">
				<span class="material-icons-round text-grey-600 text-lg">arrow_back</span>
			</a>
			<h1 class="text-grey-900 text-base font-semibold">{v8List.name}</h1>
			{#if v8List.autoCreated}
				<span class="inline-flex items-center gap-1 rounded-full border border-dashed border-grey-300 px-1.5 py-0.5 text-[10px] text-grey-400" title="Auto-created from {v8List.autoCreatedFrom?.name ?? 'enrichment'}">
					<span class="material-icons-round text-[10px]">auto_awesome</span>
					auto
				</span>
			{/if}
			{#if v8List.type === 'people'}
				<span class="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">People</span>
				<span class="text-grey-500 text-sm">{v8Contacts.length} contacts</span>
			{:else}
				<span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Company</span>
				<span class="text-grey-500 text-sm">{v8Companies.length} companies</span>
			{/if}
			{#if v8ActiveRun}
				<span class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
					<span class="material-icons-round text-xs animate-spin" style="animation-duration:1.5s">sync</span>
					Enriching {v8ActiveRun.progress}%
				</span>
			{/if}
		</div>
		<div class="flex items-center gap-2">
			{#if v8List.type === 'people'}
				<a href="{base}/app/enrich" class="btn-ghost h-8 gap-1.5 px-3 text-sm">
					<span class="material-icons-round text-violet-600 text-base">auto_awesome</span>
					Enrich
				</a>
			{/if}
			<div class="relative">
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => { v6ExportOpen = !v6ExportOpen; }}>
					<span class="material-icons-round text-grey-600 text-base">download</span>
					Export
					<span class="material-icons-round text-grey-400 text-sm">expand_more</span>
				</button>
				<ExportPopover
					bind:open={v6ExportOpen}
					context={v8List.type === 'people' ? 'people' : 'companies'}
					count={v8List.memberIds.length}
					sourceName={v8List.name}
				/>
			</div>
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Add contacts — coming soon')}>
				<span class="material-icons-round text-grey-600 text-base">person_add</span>
				Add contacts
			</button>
		</div>
	</div>

	<!-- Content -->
	<div class="flex-1 overflow-auto">
		<!-- Auto-created provenance banner -->
		{#if v8List.autoCreated && v8List.autoCreatedFrom}
			<div class="border-b border-grey-100 bg-grey-50/50 px-6 py-2.5">
				<div class="flex items-center gap-2 text-xs text-grey-500">
					<span class="material-icons-round text-sm text-grey-400">info</span>
					This list was auto-created from
					<span class="font-medium text-grey-700">{v8List.autoCreatedFrom.type === 'csv' ? 'CSV upload' : v8List.autoCreatedFrom.type === 'search' ? 'search results' : 'enrichment'}: {v8List.autoCreatedFrom.name}</span>
					<span class="text-grey-300">·</span>
					<button class="text-violet-600 hover:text-violet-700 font-medium" onclick={() => toast.show('List is now a regular list')}>Make permanent</button>
				</div>
			</div>
		{/if}

		<!-- Enrichment activity banner -->
		{#if v8ListRuns.length > 0}
			<div class="border-b border-grey-100 bg-grey-50/50 px-6 py-3">
				<div class="flex items-center justify-between mb-2">
					<p class="text-grey-700 text-xs font-semibold uppercase tracking-wider">Enrichment activity</p>
					<span class="text-grey-400 text-xs">{v8ListRuns.length} run{v8ListRuns.length > 1 ? 's' : ''}</span>
				</div>
				<div class="flex flex-col gap-1.5">
					{#each v8ListRuns.slice(0, 3) as run}
						<div class="flex items-center gap-3 rounded-lg bg-white px-3 py-2 border border-grey-100">
							<div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md
								{run.outputType === 'emails' ? 'bg-violet-50' : run.outputType === 'phones' ? 'bg-blue-50' : run.outputType === 'reverse' ? 'bg-teal-50' : 'bg-amber-50'}">
								<span class="material-icons-round text-xs
									{run.outputType === 'emails' ? 'text-violet-600' : run.outputType === 'phones' ? 'text-blue-600' : run.outputType === 'reverse' ? 'text-teal-600' : 'text-amber-600'}">
									{run.outputType === 'emails' ? 'email' : run.outputType === 'phones' ? 'phone' : run.outputType === 'reverse' ? 'swap_horiz' : 'auto_awesome'}
								</span>
							</div>
							<span class="text-grey-800 text-xs font-medium flex-1">
								{run.outputType === 'emails' ? 'Find Emails' : run.outputType === 'phones' ? 'Find Phones' : run.outputType === 'reverse' ? 'Reverse Enrich' : 'Full Enrichment'}
								<span class="text-grey-400 font-normal"> · {run.found}/{run.contactsCount} found</span>
							</span>
							{#if run.status === 'running'}
								<div class="flex items-center gap-1.5">
									<div class="bg-grey-200 h-1 w-12 overflow-hidden rounded-full">
										<div class="h-full rounded-full bg-amber-400" style:width="{run.progress}%"></div>
									</div>
									<span class="text-amber-700 text-xs font-medium">{run.progress}%</span>
								</div>
							{:else if run.status === 'queued'}
								<span class="text-grey-400 text-xs">Queued</span>
							{:else}
								<span class="text-emerald-600 text-xs font-medium">Done</span>
							{/if}
							<span class="text-grey-400 text-xs">{run.startedAt}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if v8List.type === 'people'}
			<table class="w-full min-w-[1000px]">
				<thead class="sticky top-0 z-10">
					<tr class="table-header">
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email status</th>
						<th class="w-12 px-4 py-3"></th>
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each v8Contacts as contact}
						<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
							<td class="px-4 py-3">
								<p class="text-grey-900 text-sm font-medium">{contact.firstName} {contact.lastName}</p>
							</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{contact.company}</td>
							<td class="text-grey-600 px-4 py-3 text-sm">{contact.title}</td>
							<td class="px-4 py-3">
								{#if contact.email}
									<span class="text-grey-900 font-mono text-xs">{contact.email}</span>
								{:else}
									<span class="text-grey-300 text-xs">—</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if contact.phone}
									<span class="text-grey-900 font-mono text-xs">{contact.phone}</span>
								{:else}
									<span class="text-grey-300 text-xs">—</span>
								{/if}
							</td>
							<td class="px-4 py-3">
								{#if emailStatusStyles[contact.emailStatus]}
									<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {emailStatusStyles[contact.emailStatus].color}">
										{emailStatusStyles[contact.emailStatus].label}
									</span>
								{:else}
									<span class="text-grey-300 text-xs">—</span>
								{/if}
							</td>
								<td class="px-4 py-3 text-right">
								<button
									class="btn-ghost h-7 w-7 p-0"
									title="Remove from list"
									onclick={() => toast.show(`${contact.firstName} ${contact.lastName} removed from list`)}
								>
									<span class="material-icons-round text-grey-400 text-base">close</span>
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<table class="w-full min-w-[800px]">
				<thead class="sticky top-0 z-10">
					<tr class="table-header">
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Industry</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Headcount</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Funding</th>
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each v8Companies as company}
						{#if company}
							<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
								<td class="px-4 py-3">
									<a href="{base}/app/search/companies/{company.id}" class="text-grey-900 text-sm font-medium hover:text-violet-700">{company.name}</a>
								</td>
								<td class="text-grey-700 px-4 py-3 text-sm">{company.industry}</td>
								<td class="text-grey-700 px-4 py-3 text-sm">{company.headcount.toLocaleString()}</td>
								<td class="text-grey-700 px-4 py-3 text-sm">{company.location}</td>
								<td class="px-4 py-3">
									{#if company.fundingUnlocked && company.funding}
										<span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
											{company.funding.round} · ${company.funding.amount}
										</span>
									{:else}
										<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-xs font-medium text-grey-500">
											<span class="material-icons-round text-xs">lock</span>
											Locked
										</span>
									{/if}
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>

{:else if version === 'v8' && !v8List}
<div class="flex h-full items-center justify-center">
	<p class="text-grey-400 text-sm">List not found.</p>
</div>

{:else}
<!-- Default: V1–V5 list detail -->
<div class="flex h-full flex-col">
	<!-- Header with back nav -->
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<a href="{base}/app/prospects" class="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg p-0">
				<span class="material-icons-round text-grey-600 text-lg">arrow_back</span>
			</a>
			<h1 class="text-grey-900 text-base font-semibold">{listName}</h1>
			<span class="text-grey-500 text-sm">{contacts.length} contacts</span>
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
				Export CSV
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
			<thead class="sticky top-0 z-10">
				<tr class="table-header">
					<th class="w-12 px-4 py-3">
						<input type="checkbox" checked={selectedContacts.size === contacts.length} onchange={toggleAll} />
					</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Contact</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email status</th>
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
{/if}
