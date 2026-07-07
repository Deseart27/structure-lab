<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/toast.svelte';
	import { v6Store } from '$lib/mock/v6.svelte';
	import type { JobSource, JobStatus } from '$lib/mock/v6.svelte';

	let version = $derived($page.params.version);
	let base = $derived(`${svelteBase}/${version}`);

	// ── V6 state ────────────────────────────────────────────────────────────
	let v6SearchQuery = $state('');
	let v6SearchResults = $derived(
		v6SearchQuery.length >= 2 ? v6Store.searchContacts(v6SearchQuery) : []
	);
	let v6SearchOpen = $derived(v6SearchResults.length > 0);

	// Status filter
	type StatusFilter = 'all' | 'running' | 'completed';
	let v6StatusFilter = $state<StatusFilter>('all');

	let v6FilteredJobs = $derived(v6Store.jobs.filter(job => {
		if (v6StatusFilter === 'all') return true;
		if (v6StatusFilter === 'completed') return job.status === 'completed' || job.status === 'completed-errors';
		return job.status === v6StatusFilter;
	}));

	// New enrichment modal
	let v6ModalOpen = $state(false);
	let v6ModalStep = $state<1 | 2>(1);
	let v6ModalMode = $state<'csv' | 'manual' | 'reverse' | 'crm' | 'list' | ''>('');
	let v6WantProfEmail = $state(true);
	let v6WantPhone = $state(false);
	let v6WantPersonalEmail = $state(false);

	// Export / add-to-list popovers per job
	let v6ExportJobId = $state('');
	let v6AddListJobId = $state('');

	// Animated job id (pinned running job)
	let v6AnimatingJobId = $state('');

	const sourceIcons: Record<string, string> = {
		csv: 'upload_file',
		manual: 'edit_note',
		reverse: 'swap_horiz',
		crm: 'hub',
		'search-batch': 'search',
		'search-inline': 'person_search',
	};

	const sourceLabels: Record<string, string> = {
		csv: 'CSV',
		manual: 'Manual',
		reverse: 'Reverse',
		crm: 'CRM',
		'search-batch': 'Search batch',
		'search-inline': 'Search',
	};

	function statusBadgeClass(status: JobStatus) {
		if (status === 'running') return 'bg-amber-50 text-amber-700';
		if (status === 'queued') return 'bg-grey-100 text-grey-500';
		if (status === 'completed-errors') return 'bg-orange-50 text-orange-700';
		return 'bg-emerald-50 text-emerald-700';
	}

	function statusLabel(status: JobStatus) {
		if (status === 'running') return 'Running';
		if (status === 'queued') return 'Queued';
		if (status === 'completed-errors') return 'Completed with errors';
		return 'Completed';
	}

	function v6OpenModal() {
		v6ModalOpen = true;
		v6ModalStep = 1;
		v6ModalMode = '';
		v6WantProfEmail = true;
		v6WantPhone = false;
		v6WantPersonalEmail = false;
	}

	function v6SelectMode(m: typeof v6ModalMode) {
		v6ModalMode = m;
		v6ModalStep = 2;
		v6ModalOpen = true;
		v6WantProfEmail = true;
		v6WantPhone = false;
		v6WantPersonalEmail = false;
	}

	function v6Launch() {
		v6ModalOpen = false;
		const newId = `j${Date.now()}`;
		const sourceMap: Record<string, JobSource> = { csv: 'csv', manual: 'manual', reverse: 'reverse', crm: 'crm', list: 'csv' };
		v6Store.addJob({
			id: newId,
			source: sourceMap[v6ModalMode] ?? 'csv',
			name: v6ModalMode === 'csv' ? 'New CSV upload' : v6ModalMode === 'manual' ? 'Manual batch' : v6ModalMode === 'reverse' ? 'Reverse lookup' : v6ModalMode === 'crm' ? 'CRM import' : 'From list',
			contacts: [],
			progress: 0,
			status: 'running',
			date: 'Just now',
		});
		v6AnimatingJobId = newId;
		toast.show('Enrichment started');

		// Animate progress
		let prog = 0;
		const interval = setInterval(() => {
			prog += 5;
			const job = v6Store.jobs.find(j => j.id === newId);
			if (!job) { clearInterval(interval); return; }
			// Mutate via store pattern — update in-place via addJob replacement
			// Since store exposes reactive array, mutate through a workaround:
			(job as any).progress = Math.min(prog, 100);
			if (prog >= 100) {
				(job as any).status = 'completed';
				v6AnimatingJobId = '';
				clearInterval(interval);
			}
		}, 500);
	}

	const v6PeopleLists = $derived(v6Store.lists.filter(l => l.type === 'people'));

	let mode: '' | 'csv' | 'manual' | 'list' = $state('');
	let wantPhone = $state(true);
	let wantEmail = $state(true);
	let wantPersonalEmail = $state(false);
	let enrichExportPopoverId = $state('');

	// V1: enrichment history (old model — lists inside enrich section)
	const v1Enrichments = [
		{ name: 'Q1 Sales Leads', type: 'CSV', contacts: 234, found: 198, status: 'completed', date: 'Jan 15, 2025' },
		{ name: 'LinkedIn Import', type: 'LinkedIn', contacts: 89, found: 67, status: 'completed', date: 'Jan 20, 2025' },
		{ name: 'Manual Batch #3', type: 'Manual', contacts: 12, found: 10, status: 'completed', date: 'Feb 1, 2025' },
		{ name: 'Series B Founders', type: 'CSV', contacts: 156, found: 0, status: 'running', date: 'Feb 14, 2025' },
		{ name: 'VP Engineering EU', type: 'CSV', contacts: 412, found: 387, status: 'completed', date: 'Feb 20, 2025' },
	];

	// V2: Recent Enrichments — tracks the process, not the result. Results live in Lists.
	type Enrichment = { id: string; list: string; listId: string; input: string; enrichType: string; contacts: number; found: number; status: 'completed' | 'running' | 'queued'; progress: number; started: string };
	const recentEnrichments: Enrichment[] = [
		{ id: 'e1', list: 'SaaS Founders Q1', listId: '1', input: 'CSV', enrichType: 'Phone + Email', contacts: 234, found: 198, status: 'completed', progress: 100, started: '2 hours ago' },
		{ id: 'e2', list: 'Series B Startups', listId: '3', input: 'CSV', enrichType: 'Email', contacts: 156, found: 72, status: 'running', progress: 46, started: '12 min ago' },
		{ id: 'e3', list: 'VP Sales Software', listId: '2', input: 'Manual', enrichType: 'Phone', contacts: 12, found: 0, status: 'queued', progress: 0, started: '3 min ago' },
		{ id: 'e4', list: 'Agency Owners USA', listId: '5', input: 'CSV', enrichType: 'Phone + Email', contacts: 89, found: 45, status: 'completed', progress: 100, started: '1 day ago' },
		{ id: 'e5', list: 'European Marketing Leads', listId: '4', input: 'List', enrichType: 'Phone + Email + Personal', contacts: 412, found: 387, status: 'completed', progress: 100, started: '3 days ago' },
	];

	// Mock existing lists for "Pick from your lists"
	const existingLists = [
		{ id: '1', name: 'SaaS Founders Q1', count: 234, enriched: 198 },
		{ id: '2', name: 'VP Sales Software', count: 187, enriched: 0 },
		{ id: '4', name: 'European Marketing Leads', count: 156, enriched: 89 },
		{ id: '5', name: 'Agency Owners USA', count: 89, enriched: 0 },
	];
</script>

{#if version === 'v6'}
<!-- ═══════════════════════════════════════════════════════════════════
     V6 Enrichment — Jobs table
═══════════════════════════════════════════════════════════════════ -->
<div class="flex h-full flex-col overflow-auto">
	<div class="flex justify-center pt-14 pb-20">
		<div class="mx-8 w-full max-w-[1100px]">

			<!-- Header row -->
			<div class="flex items-center justify-between gap-4 pb-4">
				<h1 class="text-grey-900 text-2xl font-semibold shrink-0">Enrichment</h1>

				<!-- Global search -->
				<div class="relative flex-1 max-w-md">
					<span class="material-icons-round text-grey-400 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base">search</span>
					<input
						class="input h-9 w-full pl-9 text-sm"
						placeholder="Search a contact across all results..."
						bind:value={v6SearchQuery}
					/>
					{#if v6SearchOpen}
						<!-- Backdrop -->
						<button class="fixed inset-0 z-20" onclick={() => { v6SearchQuery = ''; }} aria-label="Close search"></button>
						<div class="absolute left-0 top-full z-30 mt-1 w-[480px] rounded-xl border border-grey-200 bg-white shadow-lg overflow-hidden">
							{#each v6SearchResults as result}
								<button
									class="hover:bg-grey-50 flex w-full items-start gap-3 px-4 py-3 text-left transition-colors border-b border-grey-100 last:border-0"
									onclick={() => {
										v6SearchQuery = '';
										goto(`${base}/app/enrich/${result.provenances.find(p => p.type !== 'List')?.id ?? result.provenances[0]?.id ?? 'j1'}`);
									}}
								>
									<div class="flex-1 min-w-0">
										<p class="text-grey-900 text-sm font-medium">{result.contact.firstName} {result.contact.lastName}</p>
										<p class="text-grey-500 text-xs">{result.contact.title} · {result.contact.company}</p>
										{#if result.contact.email}
											<p class="text-grey-400 font-mono text-xs mt-0.5">{result.contact.email}</p>
										{/if}
									</div>
									<div class="flex flex-wrap gap-1 shrink-0 max-w-[200px] justify-end">
										{#each result.provenances.slice(0, 3) as prov}
											<span class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium
												{prov.type === 'CSV' ? 'bg-violet-50 text-violet-700' :
												 prov.type === 'Search' ? 'bg-blue-50 text-blue-700' :
												 prov.type === 'Reverse' ? 'bg-teal-50 text-teal-700' :
												 prov.type === 'CRM' ? 'bg-orange-50 text-orange-700' :
												 prov.type === 'List' ? 'bg-emerald-50 text-emerald-700' :
												 'bg-grey-100 text-grey-600'}">
												{prov.name.length > 20 ? prov.name.slice(0, 20) + '…' : prov.name}
											</span>
										{/each}
									</div>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Enrichment mode cards — always visible -->
			<div class="flex gap-2.5 pb-5">
				{#each [
					{ mode: 'csv', icon: 'upload_file', label: 'Upload CSV', sub: 'up to 64k contacts' },
					{ mode: 'manual', icon: 'edit_note', label: 'Add manually', sub: 'name + company or LinkedIn' },
					{ mode: 'reverse', icon: 'swap_horiz', label: 'Reverse emails', sub: 'paste emails, get profiles', badge: 'New' },
					{ mode: 'crm', icon: 'hub', label: 'From CRM', sub: 'enrich HubSpot lists' },
					{ mode: 'list', icon: 'format_list_bulleted', label: 'From a list', sub: 'enrich an existing list' },
				] as opt}
					<button
						class="group relative flex flex-1 items-center gap-3 rounded-xl border border-grey-200 bg-white px-4 py-3 text-left shadow-sm transition-all hover:border-violet-300 hover:bg-violet-50/40 hover:shadow-md"
						onclick={() => v6SelectMode(opt.mode as typeof v6ModalMode)}
					>
						{#if opt.badge}
							<span class="absolute -top-1.5 -right-1.5 rounded-full bg-violet-600 px-1.5 py-0.5 text-[9px] font-semibold text-white leading-none">{opt.badge}</span>
						{/if}
						<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 transition-colors group-hover:bg-violet-100">
							<span class="material-icons-round text-violet-600 text-lg">{opt.icon}</span>
						</div>
						<div class="min-w-0">
							<p class="text-grey-900 text-sm font-semibold">{opt.label}</p>
							<p class="text-grey-500 text-xs truncate">{opt.sub}</p>
						</div>
					</button>
				{/each}
			</div>

			<!-- Status filters -->
			<div class="flex items-center gap-1 pb-4">
				{#each [['all', 'All'], ['running', 'Running'], ['completed', 'Completed']] as [val, label]}
					<button
						class="h-7 rounded-full px-3 text-xs font-medium transition-colors
							{v6StatusFilter === val ? 'bg-grey-900 text-white' : 'text-grey-600 hover:bg-grey-100'}"
						onclick={() => { v6StatusFilter = val as typeof v6StatusFilter; }}
					>{label}</button>
				{/each}
			</div>

			<!-- Pinned running job banner -->
			{#if v6AnimatingJobId}
				{@const pinnedJob = v6Store.jobs.find(j => j.id === v6AnimatingJobId)}
				{#if pinnedJob && pinnedJob.status === 'running'}
					<div class="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
						<span class="material-icons-round text-amber-500 text-lg animate-spin" style="animation-duration:1.5s">sync</span>
						<p class="text-amber-800 text-sm font-medium flex-1">Enrichment runs in the background — you can safely leave this page.</p>
						<span class="text-amber-700 text-sm font-semibold">{pinnedJob.progress}%</span>
					</div>
				{/if}
			{/if}

			<!-- Jobs table -->
			<div class="list-shell overflow-hidden">
				<!-- Table header -->
				<div class="table-header grid grid-cols-[180px_1fr_90px_160px_140px_110px_auto] items-center gap-3 px-5 py-2.5">
					<span class="text-grey-600 text-xs font-semibold uppercase tracking-wider">Source</span>
					<span class="text-grey-600 text-xs font-semibold uppercase tracking-wider">Name</span>
					<span class="text-grey-600 text-xs font-semibold uppercase tracking-wider">Contacts</span>
					<span class="text-grey-600 text-xs font-semibold uppercase tracking-wider">Progress</span>
					<span class="text-grey-600 text-xs font-semibold uppercase tracking-wider">Status</span>
					<span class="text-grey-600 text-xs font-semibold uppercase tracking-wider">Date</span>
					<span class="text-grey-600 text-xs font-semibold uppercase tracking-wider">Actions</span>
				</div>

				{#each v6FilteredJobs as job, i}
					<div
						class="grid grid-cols-[180px_1fr_90px_160px_140px_110px_auto] items-center gap-3 px-5 py-4 transition-colors
							{i < v6FilteredJobs.length - 1 ? 'border-b border-grey-100' : ''}
							{job.id === v6AnimatingJobId ? 'bg-amber-50/40' : 'hover:bg-grey-50'}"
					>
						<!-- Source -->
						<div class="flex items-center gap-2">
							<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
								<span class="material-icons-round text-violet-600 text-base">{sourceIcons[job.source] ?? 'work'}</span>
							</div>
							<span class="text-grey-700 text-sm">{sourceLabels[job.source] ?? job.source}</span>
						</div>

						<!-- Name -->
						<a href="{base}/app/enrich/{job.id}" class="text-grey-900 text-sm font-medium hover:text-violet-700 truncate transition-colors">
							{job.name}
						</a>

						<!-- Contacts -->
						<span class="text-grey-700 text-sm">{job.contacts.length}</span>

						<!-- Progress -->
						<div class="flex items-center gap-2">
							<div class="bg-grey-200 h-1.5 flex-1 max-w-[100px] overflow-hidden rounded-full">
								<div
									class="h-full rounded-full transition-all
										{job.status === 'running' ? 'bg-amber-400' : job.status === 'queued' ? 'bg-grey-400' : job.status === 'completed-errors' ? 'bg-orange-400' : 'bg-emerald-500'}"
									style:width="{job.progress}%"
								></div>
							</div>
							<span class="text-grey-500 text-xs w-8 shrink-0">{job.progress}%</span>
						</div>

						<!-- Status -->
						<span class="inline-flex h-6 items-center rounded-full px-2.5 text-xs font-medium {statusBadgeClass(job.status)}">
							{statusLabel(job.status)}
						</span>

						<!-- Date -->
						<span class="text-grey-400 text-xs">{job.date}</span>

						<!-- Actions -->
						<div class="flex items-center gap-1">
							<!-- Export -->
							<div class="relative">
								<button
									class="btn-ghost flex h-7 items-center gap-1 px-2 text-xs"
									onclick={() => { v6ExportJobId = v6ExportJobId === job.id ? '' : job.id; v6AddListJobId = ''; }}
								>
									<span class="material-icons-round text-grey-500 text-sm">download</span>
									Export
									<span class="material-icons-round text-grey-400 text-xs">expand_more</span>
								</button>
								{#if v6ExportJobId === job.id}
									<button class="fixed inset-0 z-30" onclick={() => { v6ExportJobId = ''; }} aria-label="Close export"></button>
									<div class="absolute right-0 top-full z-40 mt-1 w-72 rounded-xl border border-grey-200 bg-white p-3 shadow-lg">
										<div class="mb-3 border-b border-grey-100 pb-3 flex flex-col gap-0.5">
											<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800"
												onclick={() => { v6ExportJobId = ''; toast.show(`Pushing ${job.contacts.length} contacts to HubSpot — contacts will be created or updated. Trace available in Integrations > CRM.`); }}>
												<span class="material-icons-round text-base" style="color: #ff7a59;">hub</span>
												Push to HubSpot
											</button>
											<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800"
												onclick={() => { v6ExportJobId = ''; toast.show('CSV export started — download will begin shortly.'); }}>
												<span class="material-icons-round text-grey-500 text-base">description</span>
												Export CSV
											</button>
											<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800"
												onclick={() => { v6ExportJobId = ''; toast.show('Pushed to Lemlist'); }}>
												<span class="material-icons-round text-grey-500 text-base">campaign</span>
												Push to engagement tool
											</button>
										</div>
									</div>
								{/if}
							</div>

							<!-- Add to list -->
							<div class="relative">
								<button
									class="btn-ghost flex h-7 items-center gap-1 px-2 text-xs"
									onclick={() => { v6AddListJobId = v6AddListJobId === job.id ? '' : job.id; v6ExportJobId = ''; }}
								>
									<span class="material-icons-round text-grey-500 text-sm">playlist_add</span>
									Add to list
								</button>
								{#if v6AddListJobId === job.id}
									<button class="fixed inset-0 z-20" onclick={() => { v6AddListJobId = ''; }} aria-label="Close"></button>
									<div class="absolute right-0 top-full z-30 mt-1 w-52 rounded-xl border border-grey-200 bg-white p-1.5 shadow-lg">
										{#each v6PeopleLists as list}
											<button
												class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800"
												onclick={() => { v6AddListJobId = ''; toast.show('8 added, 2 duplicates skipped'); }}
											>
												<span class="material-icons-round text-grey-400 text-base">folder</span>
												{list.name}
											</button>
										{/each}
									</div>
								{/if}
							</div>

							<!-- Detail link -->
							<a href="{base}/app/enrich/{job.id}" class="btn-ghost flex h-7 w-7 items-center justify-center p-0" title="Open detail">
								<span class="material-icons-round text-grey-400 text-base">chevron_right</span>
							</a>
						</div>
					</div>
				{/each}

				{#if v6FilteredJobs.length === 0}
					<div class="flex flex-col items-center justify-center gap-2 py-16">
						<span class="material-icons-round text-grey-300 text-4xl">inbox</span>
						<p class="text-grey-500 text-sm">No enrichment jobs match these filters.</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<!-- ── New enrichment modal ─────────────────────────────────────────── -->
{#if v6ModalOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
		<div class="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden">
			<!-- Modal header -->
			<div class="flex items-center justify-between border-b border-grey-100 px-6 py-4">
				<div class="flex items-center gap-3">
					<h2 class="text-grey-900 text-lg font-semibold">Configure enrichment</h2>
				</div>
				<button class="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg p-0" onclick={() => { v6ModalOpen = false; }}>
					<span class="material-icons-round text-grey-500 text-lg">close</span>
				</button>
			</div>

			<div class="p-6">
				{#if v6ModalStep === 2}
					<!-- Enrichment types + mode-specific input -->
					<!-- Enrichment type checkboxes -->
					<p class="text-grey-600 mb-3 text-sm font-medium">What to find?</p>
					<div class="mb-5 flex gap-3">
						<label class="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all {v6WantProfEmail ? 'border-violet-300 bg-violet-50 text-violet-800 shadow-sm' : 'border-grey-200 text-grey-600 hover:border-grey-300'}">
							<input type="checkbox" class="sr-only" bind:checked={v6WantProfEmail} />
							<span class="material-icons-round text-base">email</span>
							Professional email
						</label>
						<label class="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all {v6WantPhone ? 'border-violet-300 bg-violet-50 text-violet-800 shadow-sm' : 'border-grey-200 text-grey-600 hover:border-grey-300'}">
							<input type="checkbox" class="sr-only" bind:checked={v6WantPhone} />
							<span class="material-icons-round text-base">phone</span>
							Phone
						</label>
						<label class="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-all {v6WantPersonalEmail ? 'border-pink-300 bg-pink-50 text-pink-800 shadow-sm' : 'border-grey-200 text-grey-600 hover:border-grey-300'}">
							<input type="checkbox" class="sr-only" bind:checked={v6WantPersonalEmail} />
							<span class="material-icons-round text-base">person</span>
							Personal email
						</label>
					</div>

					<!-- Mode-specific input placeholder -->
					<p class="text-grey-600 mb-3 text-sm font-medium">
						{v6ModalMode === 'csv' ? 'Upload your file' : v6ModalMode === 'manual' ? 'Enter contacts' : v6ModalMode === 'reverse' ? 'Paste emails' : v6ModalMode === 'crm' ? 'Select HubSpot list' : 'Select list'}
					</p>
					{#if v6ModalMode === 'csv'}
						<div class="border-grey-300 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-12 transition-colors hover:border-violet-300 hover:bg-violet-50/20">
							<span class="material-icons-round text-grey-400 text-4xl">cloud_upload</span>
							<p class="text-grey-700 mt-3 font-medium text-sm">Drop your CSV or Excel file here</p>
							<p class="text-grey-500 mt-1 text-xs">Supports .csv, .xlsx — up to 64,000 contacts</p>
							<button class="btn-primary mt-4 h-9 px-4 text-sm">Select File</button>
						</div>
					{:else if v6ModalMode === 'manual'}
						<div class="flex flex-col gap-2">
							{#each [1, 2] as _}
								<div class="border-grey-200 flex gap-2 rounded-lg border p-2.5">
									<input class="input h-8 flex-1 text-sm" placeholder="First name" />
									<input class="input h-8 flex-1 text-sm" placeholder="Last name" />
									<input class="input h-8 flex-1 text-sm" placeholder="Company" />
									<input class="input h-8 flex-1 text-sm" placeholder="LinkedIn URL" />
								</div>
							{/each}
							<button class="btn-ghost flex h-8 items-center gap-1 self-start text-sm">
								<span class="material-icons-round text-base">add</span>
								Add row
							</button>
						</div>
					{:else if v6ModalMode === 'reverse'}
						<textarea
							class="input h-28 w-full resize-none text-sm font-mono"
							placeholder="sarah@stripe.com&#10;james@hubspot.com&#10;emma@datadog.com"
						></textarea>
					{:else if v6ModalMode === 'crm'}
						<div class="flex flex-col gap-2">
							{#each ['Newsletter signups', 'Cold leads 2025', 'Trial users May'] as listName}
								<label class="flex cursor-pointer items-center gap-3 rounded-xl border border-grey-200 px-4 py-3 hover:border-violet-300 hover:bg-violet-50/30 transition-colors">
									<input type="radio" name="crm-list" class="accent-violet-700" />
									<span class="text-grey-900 text-sm">{listName}</span>
								</label>
							{/each}
						</div>
					{:else}
						<div class="flex flex-col gap-2">
							{#each v6PeopleLists as list}
								<label class="flex cursor-pointer items-center gap-3 rounded-xl border border-grey-200 px-4 py-3 hover:border-violet-300 hover:bg-violet-50/30 transition-colors">
									<input type="radio" name="from-list" class="accent-violet-700" />
									<span class="text-grey-900 text-sm">{list.name}</span>
									<span class="text-grey-400 text-xs ml-auto">{list.memberIds.length} contacts</span>
								</label>
							{/each}
						</div>
					{/if}

					<!-- Launch -->
					<div class="mt-5 flex justify-end">
						<button class="btn-primary h-10 gap-2 px-5 text-sm font-semibold" onclick={v6Launch}>
							<span class="material-icons-round text-sm text-white">auto_awesome</span>
							Launch enrichment
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
{:else}
<!-- ═══════════════════════════════════════════════════════════════════
     V1–V5 existing enrichment page
═══════════════════════════════════════════════════════════════════ -->
<div class="flex h-full flex-col overflow-auto">
	<div class="flex justify-center pt-20">
		<div class="mx-8 w-full max-w-[1050px]">
			<!-- Header -->
			<div class="relative flex items-start justify-between pb-6">
				{#if mode !== ''}
					<button
						class="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg"
						onclick={() => { mode = ''; }}
					>
						<span class="material-icons-round text-grey-600 text-xl">arrow_back</span>
					</button>
				{/if}
				<h1 class="text-grey-900 text-2xl font-semibold" style:transform={mode ? 'translateX(8px)' : ''}>
					{version === 'v2' || version === 'v3' || version === 'v4' ? 'Emails & Phones' : 'New Enrichment'}
				</h1>
				{#if version !== 'v4'}
					<div class="text-grey-500 flex items-center gap-1.5 text-sm">
						<span class="material-icons-round text-base">timelapse</span>
						Contacts are stored 3 months
					</div>
				{/if}
			</div>

			<!-- Enrichment type checkboxes (shown when mode is selected, or always in v2 before mode) -->
			{#if mode !== '' || ((version === 'v2' || version === 'v3' || version === 'v4') && mode === '')}
				<div class="mb-6 flex gap-3">
					<label
						class="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-xl border text-sm font-medium transition-all {wantPhone ? 'border-violet-300 bg-violet-50 text-violet-800 shadow-sm' : 'border-grey-200 text-grey-600 hover:border-grey-300'}"
					>
						<input type="checkbox" class="sr-only" bind:checked={wantPhone} />
						<span class="material-icons-round text-base">phone</span>
						Phone
					</label>
					<label
						class="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-xl border text-sm font-medium transition-all {wantEmail ? 'border-violet-300 bg-violet-50 text-violet-800 shadow-sm' : 'border-grey-200 text-grey-600 hover:border-grey-300'}"
					>
						<input type="checkbox" class="sr-only" bind:checked={wantEmail} />
						<span class="material-icons-round text-base">email</span>
						Email
					</label>
					{#if version === 'v2' || version === 'v3' || version === 'v4'}
						<label
							class="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-xl border text-sm font-medium transition-all {wantPersonalEmail ? 'border-pink-300 bg-pink-50 text-pink-800 shadow-sm' : 'border-grey-200 text-grey-600 hover:border-grey-300'}"
						>
							<input type="checkbox" class="sr-only" bind:checked={wantPersonalEmail} />
							<span class="material-icons-round text-base">person</span>
							Personal Email
						</label>
					{/if}
				</div>
			{/if}

			<!-- Mode Selection -->
			{#if mode === ''}
				<div class="flex gap-4">
					<button
						class="border-grey-200 hover:border-violet-300 hover:bg-violet-50/40 flex flex-1 flex-col items-center gap-3 rounded-2xl border bg-white p-8 shadow-sm transition-all"
						onclick={() => { mode = 'csv'; }}
					>
						<span class="material-icons-round text-violet-700 text-3xl">upload_file</span>
						<span class="text-grey-900 font-semibold">Enrich CSV / Excel</span>
						<span class="text-grey-500 text-sm">Upload a file with contacts to enrich</span>
					</button>
					<button
						class="border-grey-200 hover:border-violet-300 hover:bg-violet-50/40 flex flex-1 flex-col items-center gap-3 rounded-2xl border bg-white p-8 shadow-sm transition-all"
						onclick={() => { mode = 'manual'; }}
					>
						<span class="material-icons-round text-violet-700 text-3xl">edit_note</span>
						<span class="text-grey-900 font-semibold">Enrich manually</span>
						<span class="text-grey-500 text-sm">Add contacts one by one</span>
					</button>
					{#if version === 'v2' || version === 'v4'}
						<button
							class="border-grey-200 hover:border-violet-300 hover:bg-violet-50/40 flex flex-1 flex-col items-center gap-3 rounded-2xl border bg-white p-8 shadow-sm transition-all"
							onclick={() => { mode = 'list'; }}
						>
							<span class="material-icons-round text-violet-700 text-3xl">format_list_bulleted</span>
							<span class="text-grey-900 font-semibold">Pick from your lists</span>
							<span class="text-grey-500 text-sm">Enrich contacts already in a list</span>
						</button>
					{/if}

				</div>

				<!-- V2/V3/V4: Recent Enrichments -->
				{#if version === 'v2' || version === 'v3' || version === 'v4'}
					{@const filteredEnrichments = version === 'v3' ? recentEnrichments.filter(e => e.input !== 'List') : recentEnrichments}
					<div class="mt-12 mb-20">
						<div class="flex items-center justify-between">
							<h2 class="text-grey-900 text-lg font-semibold">Recent Enrichments</h2>
							<span class="text-grey-500 text-sm">{filteredEnrichments.filter(e => e.status === 'running').length} running</span>
						</div>
						<div class="list-shell mt-4">
							{#each filteredEnrichments as enrichment, i}
								<div
									class="hover:bg-grey-50 flex items-center gap-4 px-5 py-4 transition-colors"
									class:border-grey-100={i < filteredEnrichments.length - 1}
									class:border-b={i < filteredEnrichments.length - 1}
								>
									<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg {enrichment.status === 'running' ? 'bg-amber-50' : enrichment.status === 'queued' ? 'bg-grey-100' : 'bg-emerald-50'}">
										<span class="material-icons-round text-lg {enrichment.status === 'running' ? 'text-amber-600' : enrichment.status === 'queued' ? 'text-grey-500' : 'text-emerald-600'}">
											{enrichment.status === 'running' ? 'sync' : enrichment.status === 'queued' ? 'schedule' : 'check_circle'}
										</span>
									</div>
									<div class="min-w-0 flex-1">
										<div class="flex items-center gap-2">
											<p class="text-grey-900 truncate text-sm font-medium">{enrichment.list}</p>
											<span class="text-grey-400 text-xs">&middot;</span>
											<span class="text-grey-500 text-xs">{enrichment.input}</span>
											<span class="text-grey-400 text-xs">&middot;</span>
											<span class="text-grey-500 text-xs">{enrichment.enrichType}</span>
										</div>
										<div class="mt-1.5 flex items-center gap-3">
											<div class="bg-grey-200 h-1.5 w-32 overflow-hidden rounded-full">
												<div
													class="h-full rounded-full transition-all {enrichment.status === 'running' ? 'bg-amber-500' : enrichment.status === 'queued' ? 'bg-grey-400' : 'bg-emerald-500'}"
													style:width="{enrichment.progress}%"
												></div>
											</div>
											<span class="text-grey-500 text-xs">
												{#if enrichment.status === 'queued'}
													Queued
												{:else}
													{enrichment.found}/{enrichment.contacts} found
												{/if}
											</span>
										</div>
									</div>
									<div class="flex shrink-0 items-center gap-3">
										<span class="text-grey-400 text-xs">{enrichment.started}</span>
										{#if enrichment.status === 'completed'}
											{#if version === 'v4'}
												<button class="btn-ghost flex h-7 items-center gap-1 px-2 text-xs" onclick={() => toast.show('Added to list')}>
													<span class="material-icons-round text-grey-500 text-sm">playlist_add</span>
													Add to list
												</button>
												<div class="relative">
													<button class="btn-ghost flex h-7 items-center gap-1 px-2 text-xs" onclick={() => { enrichExportPopoverId = enrichExportPopoverId === enrichment.id ? '' : enrichment.id; }}>
														<span class="material-icons-round text-grey-500 text-sm">download</span>
														Export
														<span class="material-icons-round text-grey-400 text-xs">expand_more</span>
													</button>
													{#if enrichExportPopoverId === enrichment.id}
														<div class="absolute right-0 top-8 z-20 w-52 rounded-xl border border-grey-200 bg-white p-1.5 shadow-lg">
															<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800" onclick={() => { enrichExportPopoverId = ''; toast.show('Pushed to HubSpot'); }}>
																<span class="material-icons-round text-base" style="color: #ff7a59;">hub</span>
																Push to CRM
															</button>
															<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800" onclick={() => { enrichExportPopoverId = ''; toast.show('CSV download started'); }}>
																<span class="material-icons-round text-grey-500 text-base">description</span>
																Export CSV
															</button>
															<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800" onclick={() => { enrichExportPopoverId = ''; toast.show('Pushed to Outreach'); }}>
																<span class="material-icons-round text-grey-500 text-base">campaign</span>
																Push to engagement tool
															</button>
														</div>
													{/if}
												</div>
											{:else if version === 'v3'}
												<a href="{base}/app/prospects" class="btn-ghost flex h-7 items-center gap-1 px-2 text-xs text-violet-700">
													All Contacts
													<span class="material-icons-round text-sm">arrow_forward</span>
												</a>
												<button class="btn-ghost flex h-7 items-center gap-1 px-2 text-xs" onclick={() => toast.show('Export started — CSV will download shortly')}>
													<span class="material-icons-round text-grey-500 text-sm">download</span>
													Export
												</button>
												<button class="btn-ghost flex h-7 items-center gap-1 px-2 text-xs" style="color: #ff7a59;" onclick={() => toast.show('Pushed to HubSpot')}>
													<span class="material-icons-round text-sm">hub</span>
													Push
												</button>
											{:else}
												<a href="{base}/app/prospects/{enrichment.listId}" class="btn-ghost flex h-7 items-center gap-1 px-2 text-xs text-violet-700">
													View in Lists
													<span class="material-icons-round text-sm">arrow_forward</span>
												</a>
											{/if}
										{:else if enrichment.status === 'running'}
											<span class="inline-flex h-6 items-center rounded-full bg-amber-50 px-2.5 text-xs font-medium text-amber-700">{enrichment.progress}%</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>

				<!-- V1: old enrichment history -->
				{:else}
					<div class="mt-12">
						<h2 class="text-grey-900 text-xl font-semibold">Contact List</h2>
						<div class="mt-6 flex items-center gap-2">
							{#each ['All Lists', 'Contact Lists', 'CSV Files'] as tab, i}
								<button
									class="h-8 rounded-full px-3 text-sm font-medium transition-colors"
									class:bg-grey-100={i === 0}
									class:text-grey-900={i === 0}
									class:text-grey-600={i !== 0}
								>
									{tab}
								</button>
							{/each}
						</div>
						<div class="mt-4 mb-20">
							{#each v1Enrichments as enrich}
								<div class="border-grey-100 hover:bg-grey-50 flex items-center justify-between border-b px-4 py-4 transition-colors">
									<div class="flex items-center gap-4">
										<div class="bg-violet-50 flex h-10 w-10 items-center justify-center rounded-lg">
											<span class="material-icons-round text-violet-700 text-lg">
												{enrich.type === 'CSV' ? 'description' : enrich.type === 'LinkedIn' ? 'link' : 'edit'}
											</span>
										</div>
										<div>
											<p class="text-grey-900 text-sm font-medium">{enrich.name}</p>
											<p class="text-grey-500 text-xs">{enrich.type} &middot; {enrich.date}</p>
										</div>
									</div>
									<div class="flex items-center gap-6">
										<div class="text-right">
											<p class="text-grey-900 text-sm font-medium">{enrich.found}/{enrich.contacts}</p>
											<p class="text-grey-500 text-xs">contacts found</p>
										</div>
										{#if enrich.status === 'completed'}
											<span class="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2.5 text-xs font-medium text-emerald-700">Completed</span>
										{:else}
											<span class="inline-flex h-6 items-center rounded-full bg-amber-50 px-2.5 text-xs font-medium text-amber-700">Running</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

			{:else}
				<!-- Input area -->
				<div class="list-shell rounded-2xl p-6">
					{#if mode === 'csv'}
						<div class="border-grey-300 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-16 transition-colors hover:border-violet-300 hover:bg-violet-50/20">
							<span class="material-icons-round text-grey-400 text-5xl">cloud_upload</span>
							<p class="text-grey-700 mt-4 font-medium">Drop your CSV or Excel file here</p>
							<p class="text-grey-500 mt-1 text-sm">Supports .csv, .xlsx — up to 64,000 contacts</p>
							<button class="btn-primary mt-4 h-10 px-4 text-sm">Select File</button>
						</div>
					{:else if mode === 'manual'}
						<div class="flex flex-col gap-3">
							{#each [1, 2, 3] as _}
								<div class="border-grey-200 flex gap-3 rounded-lg border p-3">
									<input class="input h-9 flex-1 text-sm" placeholder="First name" />
									<input class="input h-9 flex-1 text-sm" placeholder="Last name" />
									<input class="input h-9 flex-1 text-sm" placeholder="Company" />
									<input class="input h-9 flex-1 text-sm" placeholder="LinkedIn URL" />
									<button class="btn-ghost h-9 w-9 shrink-0 p-0">
										<span class="material-icons-round text-grey-400 text-base">close</span>
									</button>
								</div>
							{/each}
							<button class="btn-ghost flex h-8 items-center gap-1.5 self-start text-sm">
								<span class="material-icons-round text-base">add</span>
								Add Contact
							</button>
						</div>
					{:else if mode === 'list'}
						<!-- Pick from your lists -->
						<div class="flex flex-col gap-1">
							{#each existingLists as list}
								<button class="hover:bg-grey-50 flex items-center justify-between rounded-xl px-4 py-3 transition-colors">
									<div class="flex items-center gap-3">
										<span class="material-icons-round text-grey-400 text-lg">folder</span>
										<div class="text-left">
											<p class="text-grey-900 text-sm font-medium">{list.name}</p>
											<p class="text-grey-500 text-xs">{list.count} contacts &middot; {list.enriched > 0 ? `${Math.round((list.enriched / list.count) * 100)}% enriched` : 'Not enriched'}</p>
										</div>
									</div>
									<span class="material-icons-round text-grey-400 text-lg">chevron_right</span>
								</button>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Destination + Start (v2/v3/v4) -->
				{#if version === 'v2' || version === 'v3' || version === 'v4'}
					<div class="list-shell mt-6 mb-20 flex items-center justify-between bg-white p-4">
						<div class="flex items-center gap-4">
							{#if version === 'v2' && mode !== 'list'}
								<div class="flex items-center gap-2">
									<span class="material-icons-round text-grey-500 text-base">folder</span>
									<select class="input h-9 text-sm">
										<option>Create new list...</option>
										<option>SaaS Founders Q1</option>
										<option>VP Sales Software</option>
									</select>
								</div>
							{/if}
						</div>
						<button class="btn-primary h-10 gap-1.5 px-4 text-sm font-semibold" onclick={() => toast.show('Enrichment started')}>
							<span class="material-icons-round text-sm text-white">auto_awesome</span>
							Start Enrichment
						</button>
					</div>
				{:else}
					<div class="h-20"></div>
				{/if}
			{/if}
		</div>
	</div>
</div>
{/if}
