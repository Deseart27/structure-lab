<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { children } = $props();

	let base = $derived(`${svelteBase}/${$page.params.version}`);
	let version = $derived($page.params.version);

	let currentTab = $derived((() => {
		const path = $page.url.pathname;
		if (path.includes('/search/people')) return 'people' as const;
		if (path.includes('/search/companies')) return 'companies' as const;
		if (path.includes('/search/lists')) return 'lists' as const;
		return 'people' as const;
	})());
</script>

<section class="page m-2 flex rounded-3xl">
	<main
		class="grid w-full grid-cols-[340px_1fr] grid-rows-[1fr] overflow-hidden rounded-2xl"
		class:h-[calc(100vh-72px-16px)]={version !== 'v2' && version !== 'v3' && version !== 'v6'}
		class:h-[calc(100vh-72px-40px-16px)]={version === 'v2' || version === 'v3' || version === 'v6' || version === 'v7'}
	>
		<!-- Sidebar -->
		<aside
			class="border-grey-200 flex min-h-0 flex-col overflow-hidden rounded-l-2xl border bg-white text-sm"
		>
			{#if version !== 'v2' && version !== 'v3' && version !== 'v6'}
				<div role="tablist" aria-label="Search type" class="tablist flex shrink-0">
					<button
						class="tab"
						class:is-selected={currentTab === 'people'}
						role="tab"
						aria-selected={currentTab === 'people'}
						onclick={() => goto(`${base}/app/search/people`)}
					>
						People
					</button>
					<button
						class="tab"
						class:is-selected={currentTab === 'companies'}
						role="tab"
						aria-selected={currentTab === 'companies'}
						onclick={() => goto(`${base}/app/search/companies`)}
					>
						Companies
					</button>
					{#if version !== 'v4' && version !== 'v6'}
						<button
							class="tab"
							class:is-selected={currentTab === 'lists'}
							role="tab"
							aria-selected={currentTab === 'lists'}
							onclick={() => goto(`${base}/app/search/lists`)}
						>
							Lists
						</button>
					{/if}
				</div>
			{/if}

			{#if currentTab !== 'lists' || version === 'v2' || version === 'v3' || version === 'v4' || version === 'v6' || version === 'v7'}
				<!-- Filters sidebar -->
				<div class="min-h-0 flex-1 overflow-auto">
					<div class="p-4">
						<div class="text-grey-500 text-xs font-semibold uppercase tracking-wider mb-3">
							{currentTab === 'people' ? 'People' : 'Company'} Filters
						</div>
						{#each currentTab === 'people' ? ['Job title', 'Location', 'Seniority', 'Name', 'Skills', 'Languages', 'University'] : ['Company name', 'Domain', 'Industry', 'Headquarters', 'Headcount', 'Specialties', 'Type'] as filter}
							<button class="text-grey-800 hover:bg-grey-50 flex h-10 w-full items-center justify-between rounded-lg px-3 text-sm font-medium">
								<span>{filter}</span>
								<span class="material-icons-round text-grey-400 text-lg">add</span>
							</button>
						{/each}

						{#if currentTab === 'people'}
							<div class="border-grey-200 mt-4 border-t pt-4">
								<div class="text-grey-500 text-xs font-semibold uppercase tracking-wider mb-3">Company</div>
								{#each ['Company name', 'Domain', 'Industry', 'Headquarters', 'Headcount', 'Specialties', 'Type'] as filter}
									<button class="text-grey-800 hover:bg-grey-50 flex h-10 w-full items-center justify-between rounded-lg px-3 text-sm font-medium">
										<span>{filter}</span>
										<span class="material-icons-round text-grey-400 text-lg">add</span>
									</button>
								{/each}
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<!-- Lists sidebar content -->
				<div class="min-h-0 flex-1 overflow-auto p-4">
					<div class="text-grey-500 text-xs font-semibold uppercase tracking-wider mb-3">My Lists</div>
					{#each ['SaaS Founders Q1', 'VP Sales Software', 'Agency Owners USA'] as list}
						<button class="text-grey-800 hover:bg-grey-50 flex h-10 w-full items-center gap-2 rounded-lg px-3 text-sm font-medium">
							<span class="material-icons-round text-grey-400 text-base">folder</span>
							{list}
						</button>
					{/each}
					<div class="border-grey-200 mt-4 border-t pt-4">
						<div class="text-grey-500 text-xs font-semibold uppercase tracking-wider mb-3">Workspace Lists</div>
						{#each ['Series B Startups', 'European Marketing Leads'] as list}
							<button class="text-grey-800 hover:bg-grey-50 flex h-10 w-full items-center gap-2 rounded-lg px-3 text-sm font-medium">
								<span class="material-icons-round text-grey-400 text-base">folder</span>
								{list}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</aside>

		<!-- Content -->
		<section class="border-grey-200 min-h-0 overflow-hidden border-t border-r border-b rounded-r-2xl bg-white">
			{@render children()}
		</section>
	</main>
</section>

<style>
	.page {
		box-shadow: 0px -4px 32px -4px rgba(3, 7, 18, 0.05);
	}

	.tablist {
		position: relative;

		&::before {
			content: '';
			position: absolute;
			bottom: 0px;
			left: 0;
			height: 1px;
			width: 100%;
			background-color: var(--Grey-200, #eeedf1);
			z-index: 0;
		}
	}

	.tab {
		position: relative;
		transition: all 0.3s ease;
		flex: 1 1 0%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px;
		color: var(--Grey-700, #797783);
		font-weight: 500;
		border-bottom: 2px solid transparent;

		&:hover {
			color: var(--Violet-800, #4b25bb);
			border-color: var(--Violet-300, #ddd1ff);
		}

		&.is-selected {
			border-color: var(--Violet-800, #4b25bb);
			font-weight: 600;
			color: var(--Violet-800, #4b25bb);
		}
	}
</style>
