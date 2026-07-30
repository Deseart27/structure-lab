<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { v6Store, getSourceLabel, getSourceIcon } from '$lib/mock/v6.svelte';
	let { children } = $props();
	let version = $derived($page.params.version);
	let base = $derived(`${svelteBase}/${version}`);
	let listId = $derived($page.params.listId);
	let route = $derived($page.url.pathname);

	// V9 sidebar state
	let v9OwnerFilter = $state<'mine' | 'all'>('mine');
	let v9PeopleLists = $derived(
		(v9OwnerFilter === 'mine'
			? v6Store.lists.filter(l => l.owner === 'Francis')
			: v6Store.lists
		).filter(l => l.type === 'people')
	);
	let v9CompanyLists = $derived(
		(v9OwnerFilter === 'mine'
			? v6Store.lists.filter(l => l.owner === 'Francis')
			: v6Store.lists
		).filter(l => l.type === 'company')
	);

	// Determine what's active in the sidebar
	let isOnListDetail = $derived(!!listId);
	let isAllContacts = $derived((route.endsWith('/prospects') || route.endsWith('/prospects/')) && !$page.url.searchParams.get('enrichment'));
	let isAllCompanies = $derived(route.includes('/prospects/companies'));
	let isEnrichmentFilter = $derived(!!$page.url.searchParams.get('enrichment'));

	// V10: enrichments view
	let isEnrichmentsView = $derived($page.url.searchParams.get('view') === 'enrichments');
	let v10EnrichSearch = $state('');
	let v10FilteredRuns = $derived(
		v10EnrichSearch.trim()
			? v6Store.runs.filter(r => r.name.toLowerCase().includes(v10EnrichSearch.toLowerCase()))
			: v6Store.runs
	);

	// V11: enrichments log is default, job detail view, filters
	let v11JobId = $derived($page.url.searchParams.get('job'));
	let v11Job = $derived(v11JobId ? v6Store.getRun(v11JobId) : undefined);
	let v11IsAllContacts = $derived($page.url.searchParams.get('view') === 'contacts');
	// V11: bare /prospects with no params = enrichments log (default landing)
	let v11IsEnrichmentsLog = $derived(
		version === 'v11' && !isAllCompanies && !isOnListDetail && !v11JobId && !v11IsAllContacts && !isEnrichmentFilter
	);
	let v11EnrichSearch = $state('');
	let v11SourceFilter = $state<string>('all');
	let v11StatusFilter = $state<string>('all');
	let v11FilteredRuns = $derived(() => {
		let r = v6Store.runs;
		if (v11EnrichSearch.trim()) r = r.filter(run => run.name.toLowerCase().includes(v11EnrichSearch.toLowerCase()));
		if (v11SourceFilter !== 'all') r = r.filter(run => (run.source || run.inputMethod) === v11SourceFilter);
		if (v11StatusFilter !== 'all') r = r.filter(run => run.status === v11StatusFilter);
		return r;
	});
	let v11RunningCount = $derived(v6Store.runs.filter(r => r.status === 'running').length);
</script>

{#if version === 'v11'}
	<section class="page m-2 flex rounded-3xl">
		<main
			class="flex w-full overflow-hidden rounded-2xl border border-grey-200 bg-white"
			style="height: calc(100vh - 72px - 16px);"
		>
			<!-- Left sidebar -->
			<div class="border-grey-200 flex w-56 shrink-0 flex-col border-r bg-white overflow-y-auto rounded-l-2xl">
				<div class="flex items-center justify-between px-4 pt-4 pb-2">
					<p class="text-grey-800 text-xs font-bold uppercase tracking-wider">{isAllCompanies ? 'Companies' : 'Contacts'}</p>
				</div>

				{#if isAllCompanies}
					<nav class="flex flex-col gap-0.5 px-3 pb-4">
						<a href="{base}/app/prospects/companies" class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors {isAllCompanies && !isOnListDetail ? 'bg-violet-50 text-violet-700' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}">
							<span class="material-icons-round text-base {isAllCompanies && !isOnListDetail ? 'text-violet-500' : 'text-grey-400'}">domain</span>
							All Companies
							<span class="text-grey-400 ml-auto text-xs">{v6Store.companies.length}</span>
						</a>
						{#each v6Store.lists.filter(l => l.type === 'company') as list}
							<a href="{base}/app/prospects/{list.id}" class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors {listId === list.id ? 'bg-violet-50 text-violet-700 font-medium' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}">
								<span class="material-icons-round text-base shrink-0 {listId === list.id ? 'text-violet-500' : 'text-grey-300'}">folder</span>
								<span class="truncate flex-1">{list.name}</span>
								<span class="text-grey-400 shrink-0 text-xs">{list.memberIds.length}</span>
							</a>
						{/each}
					</nav>
				{:else}
					<!-- V11 sidebar: Enrichments first, All Contacts second, Lists third -->
					<nav class="flex flex-col gap-0.5 px-3">
						<!-- Enrichments (top, default landing) -->
						<a
							href="{base}/app/prospects"
							class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors {v11IsEnrichmentsLog || !!v11JobId ? 'bg-violet-50 text-violet-700' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}"
						>
							<span class="material-icons-round text-base {v11IsEnrichmentsLog || !!v11JobId ? 'text-violet-500' : 'text-grey-400'}">auto_awesome</span>
							Enrichments
							{#if v11RunningCount > 0}
								<span class="ml-auto flex items-center gap-1.5">
									<span class="relative flex h-2 w-2 shrink-0">
										<span class="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-violet-400 opacity-75"></span>
										<span class="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
									</span>
									<span class="text-violet-600 text-[10px] font-bold">{v11RunningCount}</span>
								</span>
							{/if}
						</a>

						<!-- All Contacts (second) -->
						<a
							href="{base}/app/prospects?view=contacts"
							class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors {v11IsAllContacts ? 'bg-violet-50 text-violet-700' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}"
						>
							<span class="material-icons-round text-base {v11IsAllContacts ? 'text-violet-500' : 'text-grey-400'}">people</span>
							All Contacts
							<span class="text-grey-400 ml-auto text-xs">{v6Store.contacts.length}</span>
						</a>
					</nav>

					<!-- Lists -->
					<div class="flex items-center justify-between px-4 pt-4 pb-1.5">
						<p class="text-grey-400 text-[10px] font-bold uppercase tracking-wider">Lists</p>
						<button class="flex h-5 w-5 items-center justify-center rounded text-grey-300 transition-colors hover:bg-grey-100 hover:text-grey-500" title="New list">
							<span class="material-icons-round text-sm">add</span>
						</button>
					</div>
					<nav class="flex flex-col gap-0.5 px-3 pb-4">
						{#each v6Store.lists.filter(l => l.type === 'people') as list}
							<a href="{base}/app/prospects/{list.id}" class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors {listId === list.id ? 'bg-violet-50 text-violet-700 font-medium' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}">
								<span class="material-icons-round text-base shrink-0 {listId === list.id ? 'text-violet-500' : 'text-grey-300'}">folder</span>
								<span class="truncate flex-1">{list.name}</span>
								<span class="text-grey-400 shrink-0 text-xs">{list.memberIds.length}</span>
							</a>
						{/each}
					</nav>
				{/if}
			</div>

			<!-- Main content -->
			<div class="flex flex-1 flex-col overflow-hidden">
				{#if v11JobId && v11Job && !isAllCompanies}
					{@render v11JobView()}
				{:else if v11IsEnrichmentsLog && !isAllCompanies}
					{@render v11EnrichmentsLog()}
				{:else}
					{@render children()}
				{/if}
			</div>
		</main>
	</section>
{:else if version === 'v10'}
	<section class="page m-2 flex rounded-3xl">
		<main
			class="flex w-full overflow-hidden rounded-2xl border border-grey-200 bg-white"
			style="height: calc(100vh - 72px - 16px);"
		>
			<!-- Left sidebar -->
			<div class="border-grey-200 flex w-56 shrink-0 flex-col border-r bg-white overflow-y-auto rounded-l-2xl">
				<div class="flex items-center justify-between px-4 pt-4 pb-2">
					<p class="text-grey-800 text-xs font-bold uppercase tracking-wider">{isAllCompanies ? 'Companies' : 'Contacts'}</p>
					<button class="flex h-7 w-7 items-center justify-center rounded-lg text-grey-400 transition-colors hover:bg-grey-100 hover:text-grey-600" title="Filters">
						<span class="material-icons-round text-base">filter_list</span>
					</button>
				</div>

				{#if isAllCompanies}
					<nav class="flex flex-col gap-0.5 px-3 pb-4">
						<a href="{base}/app/prospects/companies" class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors {isAllCompanies && !isOnListDetail ? 'bg-violet-50 text-violet-700' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}">
							<span class="material-icons-round text-base {isAllCompanies && !isOnListDetail ? 'text-violet-500' : 'text-grey-400'}">domain</span>
							All Companies
							<span class="text-grey-400 ml-auto text-xs">{v6Store.companies.length}</span>
						</a>
						{#each v6Store.lists.filter(l => l.type === 'company') as list}
							<a href="{base}/app/prospects/{list.id}" class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors {listId === list.id ? 'bg-violet-50 text-violet-700 font-medium' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}">
								<span class="material-icons-round text-base shrink-0 {listId === list.id ? 'text-violet-500' : 'text-grey-300'}">folder</span>
								<span class="truncate flex-1">{list.name}</span>
								<span class="text-grey-400 shrink-0 text-xs">{list.memberIds.length}</span>
							</a>
						{/each}
					</nav>
				{:else}
					{@const isContactsActive = (isAllContacts || isEnrichmentFilter) && !isOnListDetail && !isEnrichmentsView}
					<nav class="flex flex-col gap-0.5 px-3">
						<a href="{base}/app/prospects" class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors {isContactsActive ? 'bg-violet-50 text-violet-700' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}">
							<span class="material-icons-round text-base {isContactsActive ? 'text-violet-500' : 'text-grey-400'}">people</span>
							All Contacts
							<span class="text-grey-400 ml-auto text-xs">{v6Store.contacts.length}</span>
						</a>
						<a href="{base}/app/prospects?view=enrichments" class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors {isEnrichmentsView ? 'bg-violet-50 text-violet-700' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}">
							<span class="material-icons-round text-base {isEnrichmentsView ? 'text-violet-500' : 'text-grey-400'}">auto_awesome</span>
							Enrichments
							{#if v6Store.runs.some(r => r.status === 'completed')}
								<span class="ml-auto flex h-2 w-2 shrink-0">
									<span class="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-violet-400 opacity-75"></span>
									<span class="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
								</span>
							{/if}
						</a>
					</nav>
					<div class="px-4 pt-4 pb-1.5">
						<p class="text-grey-400 text-[10px] font-bold uppercase tracking-wider">Lists</p>
					</div>
					<nav class="flex flex-col gap-0.5 px-3 pb-4">
						{#each v6Store.lists.filter(l => l.type === 'people') as list}
							<a href="{base}/app/prospects/{list.id}" class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors {listId === list.id ? 'bg-violet-50 text-violet-700 font-medium' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}">
								<span class="material-icons-round text-base shrink-0 {listId === list.id ? 'text-violet-500' : 'text-grey-300'}">folder</span>
								<span class="truncate flex-1">{list.name}</span>
								<span class="text-grey-400 shrink-0 text-xs">{list.memberIds.length}</span>
							</a>
						{/each}
					</nav>
				{/if}
			</div>

			<div class="flex flex-1 flex-col overflow-hidden">
				{#if isEnrichmentsView && !isAllCompanies}
					{@render v10EnrichmentsView()}
				{:else}
					{@render children()}
				{/if}
			</div>
		</main>
	</section>
{:else if version === 'v9'}
	<section class="page m-2 flex rounded-3xl">
		<main
			class="flex w-full overflow-hidden rounded-2xl border border-grey-200 bg-white"
			style="height: calc(100vh - 72px - 16px);"
		>
			<!-- Left sidebar -->
			<div class="border-grey-200 flex w-56 shrink-0 flex-col border-r bg-white overflow-y-auto rounded-l-2xl">
				<!-- Owner filter -->
				<div class="px-3 pt-4 pb-3">
					<div class="flex items-center rounded-lg border border-grey-200 p-0.5">
						<button
							class="flex-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors {v9OwnerFilter === 'mine' ? 'bg-grey-100 text-grey-900' : 'text-grey-500 hover:text-grey-700'}"
							onclick={() => { v9OwnerFilter = 'mine'; }}
						>My lists</button>
						<button
							class="flex-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors {v9OwnerFilter === 'all' ? 'bg-grey-100 text-grey-900' : 'text-grey-500 hover:text-grey-700'}"
							onclick={() => { v9OwnerFilter = 'all'; }}
						>All lists</button>
					</div>
				</div>

				<!-- Contacts section -->
				<div class="px-4 pt-3 pb-1.5">
					<p class="text-grey-800 text-xs font-bold uppercase tracking-wider">Contacts</p>
				</div>
				<nav class="flex flex-col gap-0.5 px-3">
					<a
						href="{base}/app/prospects"
						class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors {isAllContacts && !isOnListDetail ? 'bg-violet-50 text-violet-700' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}"
					>
						<span class="material-icons-round text-base {isAllContacts && !isOnListDetail ? 'text-violet-500' : 'text-grey-400'}">people</span>
						All Contacts
						<span class="text-grey-400 ml-auto text-xs">{v6Store.contacts.length}</span>
					</a>
					{#each v9PeopleLists as list}
						<a
							href="{base}/app/prospects/{list.id}"
							class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors {listId === list.id ? 'bg-violet-50 text-violet-700 font-medium' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}"
						>
							<span class="material-icons-round text-base shrink-0 {listId === list.id ? 'text-violet-500' : 'text-grey-300'}">folder</span>
							<span class="truncate flex-1">{list.name}</span>
							<span class="text-grey-400 shrink-0 text-xs">{list.memberIds.length}</span>
						</a>
					{/each}
				</nav>

				<!-- Companies section -->
				<div class="px-4 pt-5 pb-1.5">
					<p class="text-grey-800 text-xs font-bold uppercase tracking-wider">Companies</p>
				</div>
				<nav class="flex flex-col gap-0.5 px-3 pb-4">
					<a
						href="{base}/app/prospects/companies"
						class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors {isAllCompanies ? 'bg-violet-50 text-violet-700' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}"
					>
						<span class="material-icons-round text-base {isAllCompanies ? 'text-violet-500' : 'text-grey-400'}">domain</span>
						All Companies
						<span class="text-grey-400 ml-auto text-xs">{v6Store.companies.length}</span>
					</a>
					{#each v9CompanyLists as list}
						<a
							href="{base}/app/prospects/{list.id}"
							class="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors {listId === list.id ? 'bg-violet-50 text-violet-700 font-medium' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}"
						>
							<span class="material-icons-round text-base shrink-0 {listId === list.id ? 'text-violet-500' : 'text-grey-300'}">folder</span>
							<span class="truncate flex-1">{list.name}</span>
							<span class="text-grey-400 shrink-0 text-xs">{list.memberIds.length}</span>
						</a>
					{/each}
				</nav>
			</div>

			<!-- Main content -->
			<div class="flex flex-1 flex-col overflow-hidden">
				{@render children()}
			</div>
		</main>
	</section>
{:else if version === 'v4' || version === 'v6' || version === 'v7' || version === 'v8'}
	<section class="page m-2 flex rounded-3xl">
		<main
			class="flex w-full flex-col overflow-hidden rounded-2xl border border-grey-200 bg-white"
			style="height: calc(100vh - 72px - 16px);"
		>
			{@render children()}
		</main>
	</section>
{:else}
	<div
		class="flex flex-col overflow-hidden"
		class:h-[calc(100vh-64px)]={version !== 'v2' && version !== 'v3' && version !== 'v6'}
		class:h-[calc(100vh-64px-40px)]={version === 'v2' || version === 'v3' || version === 'v6' || version === 'v7' || version === 'v8' || version === 'v9' || version === 'v10' || version === 'v11'}
	>
		{@render children()}
	</div>
{/if}

{#snippet v10EnrichmentsView()}
<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h1 class="text-grey-900 text-base font-semibold">Enrichments</h1>
			<span class="text-grey-500 text-sm">{v6Store.runs.length} enrichment runs</span>
		</div>
	</div>

	<!-- Search -->
	<div class="border-grey-100 border-b px-6 py-3">
		<div class="flex items-center gap-2 rounded-lg border border-grey-200 bg-grey-50 px-3 py-2">
			<span class="material-icons-round text-grey-400 text-base">search</span>
			<input
				type="text"
				placeholder="Search enrichments…"
				class="w-full bg-transparent text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none"
				bind:value={v10EnrichSearch}
			/>
			{#if v10EnrichSearch}
				<button class="text-grey-400 hover:text-grey-600" onclick={() => { v10EnrichSearch = ''; }}>
					<span class="material-icons-round text-sm">close</span>
				</button>
			{/if}
		</div>
	</div>

	<!-- Enrichment list -->
	<div class="flex-1 overflow-auto">
		{#each v10FilteredRuns as run}
			<a
				href="{base}/app/prospects?enrichment={run.id}"
				class="flex w-full items-center gap-4 border-b border-grey-100 px-6 py-4 text-left transition-colors hover:bg-grey-50"
			>
				<!-- Status icon -->
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl {run.status === 'running' ? 'bg-violet-100' : run.status === 'completed' ? 'bg-emerald-50' : 'bg-grey-100'}">
					<span class="material-icons-round text-lg {run.status === 'running' ? 'text-violet-600' : run.status === 'completed' ? 'text-emerald-600' : 'text-grey-400'}">
						{run.inputMethod === 'csv' ? 'description' : run.inputMethod === 'search' ? 'search' : run.inputMethod === 'crm' ? 'hub' : run.inputMethod === 'manual' ? 'edit' : 'bolt'}
					</span>
				</div>

				<!-- Info -->
				<div class="min-w-0 flex-1">
					<p class="text-grey-900 text-sm font-medium truncate">{run.name}</p>
					<div class="flex items-center gap-3 mt-0.5">
						<span class="text-grey-400 text-xs">{run.startedAt}</span>
						<span class="text-grey-300 text-xs">·</span>
						<span class="text-grey-500 text-xs">{run.contactsCount} contacts</span>
						<span class="text-grey-300 text-xs">·</span>
						<span class="text-grey-500 text-xs">{run.found} found</span>
					</div>
				</div>

				<!-- Type badge -->
				<span class="shrink-0 rounded-full border border-grey-200 px-2 py-0.5 text-[10px] font-medium text-grey-500">
					{run.outputType === 'emails' ? 'Emails' : run.outputType === 'phones' ? 'Phones' : run.outputType === 'reverse' ? 'Reverse' : run.outputType === 'all' ? 'Emails & Phones' : run.outputType}
				</span>

				<!-- Status -->
				{#if run.status === 'running'}
					<div class="flex shrink-0 items-center gap-2">
						<div class="bg-grey-200 h-1.5 w-16 overflow-hidden rounded-full">
							<div class="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600" style:width="{run.progress}%"></div>
						</div>
						<span class="text-violet-600 text-xs font-bold">{run.progress}%</span>
					</div>
				{:else if run.status === 'completed'}
					<span class="relative flex h-2 w-2 shrink-0">
						<span class="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-violet-400 opacity-75"></span>
						<span class="relative inline-flex h-2 w-2 rounded-full bg-violet-500"></span>
					</span>
					<span class="material-icons-round text-emerald-500 text-base shrink-0">check_circle</span>
				{:else}
					<span class="material-icons-round text-grey-300 text-base shrink-0">schedule</span>
				{/if}

				<!-- Download button -->
				<button
					class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-grey-300 transition-colors hover:bg-grey-100 hover:text-grey-600"
					title="Export CSV"
					onclick={(e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); }}
				>
					<span class="material-icons-round text-base">download</span>
				</button>

				<span class="material-icons-round text-grey-300 text-base shrink-0">chevron_right</span>
			</a>
		{/each}

		{#if v10FilteredRuns.length === 0}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<span class="material-icons-round text-grey-300 text-4xl">search_off</span>
				<p class="text-grey-400 mt-2 text-sm">No enrichments matching "{v10EnrichSearch}"</p>
			</div>
		{/if}
	</div>
</div>
{/snippet}

{#snippet v11EnrichmentsLog()}
{@const filteredRuns = v11FilteredRuns()}
<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h1 class="text-grey-900 text-base font-semibold">Enrichments</h1>
			<span class="text-grey-500 text-sm">{v6Store.runs.length} jobs</span>
		</div>
	</div>

	<!-- Filters bar -->
	<div class="border-grey-100 flex items-center gap-3 border-b px-6 py-3">
		<div class="flex items-center gap-2 rounded-lg border border-grey-200 bg-grey-50 px-3 py-2 flex-1 max-w-xs">
			<span class="material-icons-round text-grey-400 text-base">search</span>
			<input type="text" placeholder="Search enrichments…" class="w-full bg-transparent text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none" bind:value={v11EnrichSearch} />
			{#if v11EnrichSearch}
				<button class="text-grey-400 hover:text-grey-600" onclick={() => { v11EnrichSearch = ''; }}>
					<span class="material-icons-round text-sm">close</span>
				</button>
			{/if}
		</div>
		<select class="rounded-lg border border-grey-200 bg-white px-2.5 py-2 text-xs font-medium text-grey-600 focus:outline-none focus:ring-1 focus:ring-violet-300" bind:value={v11SourceFilter}>
			<option value="all">All sources</option>
			<option value="csv">CSV</option>
			<option value="manual">Manual</option>
			<option value="search">Search</option>
			<option value="reverse">Reverse</option>
			<option value="crm">CRM</option>
			<option value="api">API</option>
			<option value="mcp">MCP</option>
			<option value="clay">Clay</option>
			<option value="n8n">n8n</option>
			<option value="make">Make</option>
			<option value="zapier">Zapier</option>
		</select>
		<select class="rounded-lg border border-grey-200 bg-white px-2.5 py-2 text-xs font-medium text-grey-600 focus:outline-none focus:ring-1 focus:ring-violet-300" bind:value={v11StatusFilter}>
			<option value="all">All statuses</option>
			<option value="running">Running</option>
			<option value="queued">Queued</option>
			<option value="completed">Completed</option>
			<option value="completed-errors">Completed with errors</option>
		</select>
	</div>

	<!-- Table header -->
	<div class="grid shrink-0 grid-cols-[minmax(0,2fr)_minmax(0,3fr)_80px_80px_minmax(0,2fr)_150px_100px_100px] items-center border-b border-grey-200 bg-grey-50 px-6 py-2 text-[11px] font-semibold uppercase tracking-wider text-grey-400">
		<span>Source</span>
		<span>Name</span>
		<span class="text-center">Contacts</span>
		<span class="text-center">Found</span>
		<span>Results</span>
		<span>Status</span>
		<span>Date</span>
		<span class="text-right">Actions</span>
	</div>

	<!-- Rows -->
	<div class="flex-1 overflow-auto">
		{#each filteredRuns as run}
			<a
				href="{base}/app/prospects?job={run.id}"
				class="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)_80px_80px_minmax(0,2fr)_150px_100px_100px] items-center border-b border-grey-100 px-6 py-3 transition-colors hover:bg-grey-50"
			>
				<!-- Source -->
				<div class="flex items-center gap-2">
					<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg {run.source === 'api' || run.source === 'mcp' ? 'bg-blue-50' : run.source === 'clay' || run.source === 'n8n' || run.source === 'make' || run.source === 'zapier' ? 'bg-amber-50' : 'bg-grey-100'}">
						<span class="material-icons-round text-sm {run.source === 'api' || run.source === 'mcp' ? 'text-blue-500' : run.source === 'clay' || run.source === 'n8n' || run.source === 'make' || run.source === 'zapier' ? 'text-amber-600' : 'text-grey-500'}">{getSourceIcon(run.source, run.inputMethod)}</span>
					</div>
					<span class="text-xs font-medium text-grey-700">{getSourceLabel(run.source, run.inputMethod)}</span>
				</div>

				<!-- Name -->
				<span class="text-sm text-grey-900 truncate pr-2">{run.name}</span>

				<!-- Contacts -->
				<span class="text-sm text-grey-600 text-center">{run.contactsCount}</span>

				<!-- Found -->
				<span class="text-sm text-center {run.found > 0 ? 'text-grey-900 font-medium' : 'text-grey-400'}">{run.found}/{run.contactsCount}</span>

				<!-- Results breakdown -->
				<div class="flex items-center gap-2">
					{#if run.foundByType}
						{#if run.foundByType.email != null}
							<span class="inline-flex items-center gap-0.5 text-[10px] text-grey-500"><span class="material-icons-round text-pink-400 text-[11px]">email</span>{run.foundByType.email}</span>
						{/if}
						{#if run.foundByType.phone != null}
							<span class="inline-flex items-center gap-0.5 text-[10px] text-grey-500"><span class="material-icons-round text-violet-400 text-[11px]">phone</span>{run.foundByType.phone}</span>
						{/if}
					{:else}
						<span class="inline-flex items-center gap-0.5 text-[10px] text-grey-500"><span class="material-icons-round text-pink-400 text-[11px]">email</span>{run.found}</span>
					{/if}
				</div>

				<!-- Status -->
				<div class="flex items-center gap-2">
					{#if run.status === 'running'}
						<div class="bg-grey-200 h-1.5 w-16 overflow-hidden rounded-full">
							<div class="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600" style:width="{run.progress}%"></div>
						</div>
						<span class="text-violet-600 text-xs font-bold">{run.progress}%</span>
					{:else if run.status === 'completed'}
						<span class="material-icons-round text-emerald-500 text-sm">check_circle</span>
						<span class="text-xs text-emerald-600 font-medium">Completed</span>
					{:else if run.status === 'completed-errors'}
						<span class="material-icons-round text-amber-500 text-sm">warning</span>
						<span class="text-xs text-amber-600 font-medium">Errors</span>
					{:else}
						<span class="material-icons-round text-grey-300 text-sm">schedule</span>
						<span class="text-xs text-grey-500">Queued</span>
					{/if}
				</div>

				<!-- Date -->
				<span class="text-xs text-grey-400">{run.startedAt}</span>

				<!-- Quick actions -->
				<div class="flex items-center justify-end gap-1">
					<button class="flex h-7 w-7 items-center justify-center rounded-lg text-grey-300 transition-colors hover:bg-grey-100 hover:text-grey-600" title="Download" onclick={(e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); }}>
						<span class="material-icons-round text-sm">download</span>
					</button>
					<button class="flex h-7 w-7 items-center justify-center rounded-lg text-grey-300 transition-colors hover:bg-grey-100 hover:text-grey-600" title="Push to CRM" onclick={(e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); }}>
						<span class="material-icons-round text-sm">cloud_upload</span>
					</button>
					<button class="flex h-7 w-7 items-center justify-center rounded-lg text-grey-300 transition-colors hover:bg-grey-100 hover:text-grey-600" title="Add to list" onclick={(e: MouseEvent) => { e.preventDefault(); e.stopPropagation(); }}>
						<span class="material-icons-round text-sm">playlist_add</span>
					</button>
				</div>
			</a>
		{/each}

		{#if filteredRuns.length === 0}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<span class="material-icons-round text-grey-300 text-4xl">search_off</span>
				<p class="text-grey-400 mt-2 text-sm">No enrichments match your filters</p>
			</div>
		{/if}
	</div>
</div>
{/snippet}

{#snippet v11JobView()}
{@const run = v11Job!}
{@const jobContacts = v6Store.getContactsForRun(run)}
<div class="flex h-full flex-col">
	<!-- Breadcrumb -->
	<div class="border-grey-200 flex h-10 shrink-0 items-center gap-1.5 border-b px-6 text-xs">
		<a href="{base}/app/prospects" class="text-grey-400 hover:text-grey-600 transition-colors">Contacts</a>
		<span class="material-icons-round text-grey-300 text-xs">chevron_right</span>
		<a href="{base}/app/prospects" class="text-grey-400 hover:text-grey-600 transition-colors">Enrichments</a>
		<span class="material-icons-round text-grey-300 text-xs">chevron_right</span>
		<span class="text-grey-700 font-medium">{run.name}</span>
	</div>

	<!-- Job banner -->
	<div class="border-grey-200 shrink-0 border-b bg-grey-50 px-6 py-4">
		<div class="flex items-start justify-between gap-4">
			<div class="flex items-start gap-3 min-w-0">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl {run.status === 'running' ? 'bg-violet-100' : run.status === 'completed' ? 'bg-emerald-50' : run.status === 'completed-errors' ? 'bg-amber-50' : 'bg-grey-100'}">
					<span class="material-icons-round text-lg {run.status === 'running' ? 'text-violet-600' : run.status === 'completed' ? 'text-emerald-600' : run.status === 'completed-errors' ? 'text-amber-600' : 'text-grey-400'}">{getSourceIcon(run.source, run.inputMethod)}</span>
				</div>
				<div class="min-w-0">
					<div class="flex items-center gap-2">
						<h2 class="text-grey-900 text-base font-semibold truncate">{run.name}</h2>
						<span class="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium {run.source === 'api' || run.source === 'mcp' ? 'border-blue-200 bg-blue-50 text-blue-600' : run.source === 'clay' || run.source === 'n8n' || run.source === 'make' || run.source === 'zapier' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-grey-200 text-grey-500'}">{getSourceLabel(run.source, run.inputMethod)}</span>
					</div>
					<div class="flex items-center gap-4 mt-1.5 text-xs text-grey-500">
						<span>{run.startedAt}</span>
						{#if run.launchedBy}<span>by {run.launchedBy}</span>{/if}
						{#if run.creditsSpent}<span>{run.creditsSpent} credits</span>{/if}
					</div>
				</div>
			</div>

			<!-- Banner actions -->
			<div class="flex items-center gap-2 shrink-0">
				<button class="flex items-center gap-1.5 rounded-lg border border-grey-200 bg-white px-3 py-1.5 text-xs font-medium text-grey-700 shadow-sm transition-colors hover:bg-grey-50">
					<span class="material-icons-round text-sm">download</span> Download
				</button>
				<button class="flex items-center gap-1.5 rounded-lg border border-grey-200 bg-white px-3 py-1.5 text-xs font-medium text-grey-700 shadow-sm transition-colors hover:bg-grey-50">
					<span class="material-icons-round text-sm">cloud_upload</span> Push to CRM
				</button>
				<button class="flex items-center gap-1.5 rounded-lg border border-grey-200 bg-white px-3 py-1.5 text-xs font-medium text-grey-700 shadow-sm transition-colors hover:bg-grey-50">
					<span class="material-icons-round text-sm">playlist_add</span> Add to list
				</button>
			</div>
		</div>

		<!-- Status + data types row -->
		<div class="mt-3 flex items-center gap-4">
			{#if run.status === 'running'}
				<div class="flex items-center gap-2">
					<div class="bg-grey-200 h-2 w-24 overflow-hidden rounded-full">
						<div class="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600" style:width="{run.progress}%"></div>
					</div>
					<span class="text-violet-600 text-xs font-bold">{run.progress}%</span>
					<span class="text-grey-400 text-xs">· Enrichment runs in the background — you can safely leave this page.</span>
				</div>
			{:else if run.status === 'completed'}
				<div class="flex items-center gap-1.5">
					<span class="material-icons-round text-emerald-500 text-sm">check_circle</span>
					<span class="text-xs font-medium text-emerald-600">Completed</span>
				</div>
			{:else if run.status === 'completed-errors'}
				<div class="flex items-center gap-1.5">
					<span class="material-icons-round text-amber-500 text-sm">warning</span>
					<span class="text-xs font-medium text-amber-600">Completed with errors</span>
					{#if run.errorSummary}<span class="text-xs text-grey-400">— {run.errorSummary}</span>{/if}
				</div>
			{:else}
				<div class="flex items-center gap-1.5">
					<span class="material-icons-round text-grey-300 text-sm">schedule</span>
					<span class="text-xs text-grey-500">Queued</span>
				</div>
			{/if}
			</div>

		<!-- Enrichment results -->
		<div class="mt-3 flex items-center gap-6">
			<div class="flex items-center gap-1.5 text-xs">
				<span class="text-grey-400">Contacts</span>
				<span class="text-grey-900 font-semibold">{run.contactsCount}</span>
			</div>
			<div class="flex items-center gap-1.5 text-xs">
				<span class="text-grey-400">Found</span>
				<span class="text-grey-900 font-semibold">{run.found}<span class="text-grey-400 font-normal">/{run.contactsCount}</span></span>
			</div>
			{#if run.foundByType?.email != null}
				<div class="flex items-center gap-1 text-xs">
					<span class="material-icons-round text-pink-400 text-sm">email</span>
					<span class="text-grey-900 font-semibold">{run.foundByType.email}</span>
				</div>
			{/if}
			{#if run.foundByType?.phone != null}
				<div class="flex items-center gap-1 text-xs">
					<span class="material-icons-round text-violet-400 text-sm">phone</span>
					<span class="text-grey-900 font-semibold">{run.foundByType.phone}</span>
				</div>
			{/if}
			{#if run.foundByType?.personal_email != null}
				<div class="flex items-center gap-1 text-xs">
					<span class="material-icons-round text-blue-400 text-sm">alternate_email</span>
					<span class="text-grey-900 font-semibold">{run.foundByType.personal_email}</span>
				</div>
			{/if}
			{#if run.creditsSpent}
				<div class="flex items-center gap-1 text-xs">
					<span class="material-icons-round text-amber-400 text-sm">stars</span>
					<span class="text-grey-900 font-semibold">{run.creditsSpent}</span>
					<span class="text-grey-400">credits</span>
				</div>
			{/if}
		</div>
	</div>

	<!-- Contact table -->
	<div class="flex flex-1 flex-col overflow-hidden">
		<!-- Table header -->
		<div class="grid shrink-0 grid-cols-[28px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_minmax(0,1fr)_100px_80px] items-center border-b border-grey-200 bg-white px-6 py-2 text-[11px] font-semibold uppercase tracking-wider text-grey-400">
			<input type="checkbox" class="h-3.5 w-3.5 rounded border-grey-300" />
			<span>Contact</span>
			<span>Email</span>
			<span>Phone</span>
			<span>Company</span>
			<span>Email status</span>
			<span>Lists</span>
		</div>

		<!-- Rows -->
		<div class="flex-1 overflow-auto">
			{#each jobContacts as contact}
				{@const contactLists = v6Store.getListsForContact(contact.id)}
				<div class="grid grid-cols-[28px_minmax(0,2fr)_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)_100px_80px] items-center border-b border-grey-100 px-6 py-2.5 text-sm hover:bg-grey-50 transition-colors">
					<input type="checkbox" class="h-3.5 w-3.5 rounded border-grey-300" />
					<div class="flex items-center gap-2 min-w-0">
						<div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[10px] font-bold text-violet-700">{contact.firstName[0]}{contact.lastName[0]}</div>
						<div class="min-w-0">
							<p class="text-grey-900 text-sm font-medium truncate">{contact.firstName} {contact.lastName}</p>
							<p class="text-grey-400 text-xs truncate">{contact.title}</p>
						</div>
					</div>
					<span class="text-grey-600 text-xs truncate">{contact.email || '—'}</span>
					<span class="text-grey-600 text-xs truncate">{contact.phone || '—'}</span>
					<span class="text-grey-600 text-xs truncate">{contact.company}</span>
					<div>
						{#if contact.emailStatus === 'valid'}
							<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">Valid</span>
						{:else if contact.emailStatus === 'catch-all'}
							<span class="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">Catch-all</span>
						{:else if contact.emailStatus === 'invalid-found'}
							<span class="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-medium text-orange-700">Invalid</span>
						{:else if contact.emailStatus === 'not-found'}
							<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">Not found</span>
						{:else}
							<span class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">Pending</span>
						{/if}
					</div>
					<div class="flex items-center gap-1">
						{#each contactLists.slice(0, 2) as cl}
							<span class="rounded bg-grey-100 px-1.5 py-0.5 text-[10px] font-medium text-grey-500 truncate max-w-[60px]">{cl.name}</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
{/snippet}

<style>
	.page {
		box-shadow: 0px -4px 32px -4px rgba(3, 7, 18, 0.05);
	}
</style>
