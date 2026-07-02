<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';

	let version = $derived($page.params.version);
	let base = $derived(`${svelteBase}/${version}`);

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
