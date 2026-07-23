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
</script>

{#if version === 'v9'}
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
		class:h-[calc(100vh-64px-40px)]={version === 'v2' || version === 'v3' || version === 'v6' || version === 'v7' || version === 'v8' || version === 'v9'}
	>
		{@render children()}
	</div>
{/if}

<style>
	.page {
		box-shadow: 0px -4px 32px -4px rgba(3, 7, 18, 0.05);
	}
</style>
