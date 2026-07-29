<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { v6Store } from '$lib/mock/v6.svelte';
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
</script>

{#if version === 'v10'}
	<section class="page m-2 flex rounded-3xl">
		<main
			class="flex w-full overflow-hidden rounded-2xl border border-grey-200 bg-white"
			style="height: calc(100vh - 72px - 16px);"
		>
			<!-- Left sidebar -->
			<div class="border-grey-200 flex w-56 shrink-0 flex-col border-r bg-white overflow-y-auto rounded-l-2xl">
				<!-- Header -->
				<div class="flex items-center justify-between px-4 pt-4 pb-2">
					<p class="text-grey-800 text-xs font-bold uppercase tracking-wider">{isAllCompanies ? 'Companies' : 'Contacts'}</p>
					<button
						class="flex h-7 w-7 items-center justify-center rounded-lg text-grey-400 transition-colors hover:bg-grey-100 hover:text-grey-600"
						title="Filters"
					>
						<span class="material-icons-round text-base">filter_list</span>
					</button>
				</div>

				{#if isAllCompanies}
					<!-- Companies sidebar -->
					<nav class="flex flex-col gap-0.5 px-3 pb-4">
						<a
							href="{base}/app/prospects/companies"
							class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors {isAllCompanies && !isOnListDetail ? 'bg-violet-50 text-violet-700' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}"
						>
							<span class="material-icons-round text-base {isAllCompanies && !isOnListDetail ? 'text-violet-500' : 'text-grey-400'}">domain</span>
							All Companies
							<span class="text-grey-400 ml-auto text-xs">{v6Store.companies.length}</span>
						</a>
						{#each v6Store.lists.filter(l => l.type === 'company') as list}
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
				{:else}
					<!-- Contacts sidebar -->
					{@const isContactsActive = (isAllContacts || isEnrichmentFilter) && !isOnListDetail && !isEnrichmentsView}
					<nav class="flex flex-col gap-0.5 px-3">
						<a
							href="{base}/app/prospects"
							class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors {isContactsActive ? 'bg-violet-50 text-violet-700' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}"
						>
							<span class="material-icons-round text-base {isContactsActive ? 'text-violet-500' : 'text-grey-400'}">people</span>
							All Contacts
							<span class="text-grey-400 ml-auto text-xs">{v6Store.contacts.length}</span>
						</a>

						<!-- Enrichments — right after All Contacts -->
						<a
							href="{base}/app/prospects?view=enrichments"
							class="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors {isEnrichmentsView ? 'bg-violet-50 text-violet-700' : 'text-grey-600 hover:bg-grey-50 hover:text-grey-900'}"
						>
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

					<!-- Lists -->
					<div class="px-4 pt-4 pb-1.5">
						<p class="text-grey-400 text-[10px] font-bold uppercase tracking-wider">Lists</p>
					</div>
					<nav class="flex flex-col gap-0.5 px-3 pb-4">
						{#each v6Store.lists.filter(l => l.type === 'people') as list}
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
				{/if}
			</div>

			<!-- Main content -->
			<div class="flex flex-1 flex-col overflow-hidden">
				{#if isEnrichmentsView && !isAllCompanies}
					<!-- Enrichments full view -->
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
		class:h-[calc(100vh-64px-40px)]={version === 'v2' || version === 'v3' || version === 'v6' || version === 'v7' || version === 'v8' || version === 'v9' || version === 'v10'}
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
						{#if run.listName}
							<span class="text-grey-300 text-xs">·</span>
							<span class="inline-flex items-center gap-1 text-xs text-grey-500">
								<span class="material-icons-round text-[10px]">folder</span>
								{run.listName}
							</span>
						{/if}
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

<style>
	.page {
		box-shadow: 0px -4px 32px -4px rgba(3, 7, 18, 0.05);
	}
</style>
