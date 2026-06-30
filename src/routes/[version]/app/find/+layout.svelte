<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let { children } = $props();

	let base = $derived(`${svelteBase}/${$page.params.version}`);

	let currentTab = $derived((() => {
		const path = $page.url.pathname;
		if (path.includes('/find/people')) return 'people' as const;
		if (path.includes('/find/companies')) return 'companies' as const;
		if (path.includes('/find/csv')) return 'csv' as const;
		if (path.includes('/find/manual')) return 'manual' as const;
		if (path.includes('/find/reverse')) return 'reverse' as const;
		if (path.includes('/find/crm')) return 'crm' as const;
		return 'people' as const;
	})());

	const tabs = [
		{ id: 'people', label: 'People Search', icon: 'person_search' },
		{ id: 'companies', label: 'Companies', icon: 'domain' },
		{ id: 'csv', label: 'CSV / Excel', icon: 'upload_file' },
		{ id: 'manual', label: 'Manual', icon: 'edit' },
		{ id: 'reverse', label: 'Reverse Lookup', icon: 'swap_horiz' },
		{ id: 'crm', label: 'CRM Enrich', icon: 'hub' },
	] as const;
</script>

<section class="page m-2 flex rounded-3xl">
	<main
		class="grid h-[calc(100vh-72px-16px)] w-full grid-cols-[340px_1fr] grid-rows-[1fr] overflow-hidden rounded-2xl"
	>
		<!-- Sidebar -->
		<aside
			class="border-grey-200 flex min-h-0 flex-col overflow-hidden rounded-l-2xl border bg-white text-sm"
		>
			<!-- Entry mode tabs -->
			<div class="border-grey-200 shrink-0 border-b p-3">
				<div class="text-grey-500 mb-2 px-2 text-xs font-semibold uppercase tracking-wider">Entry mode</div>
				{#each tabs as tab}
					<button
						class="flex h-9 w-full items-center gap-2.5 rounded-lg px-2.5 text-sm font-medium transition-colors"
						class:bg-violet-50={currentTab === tab.id}
						class:text-violet-800={currentTab === tab.id}
						class:text-grey-700={currentTab !== tab.id}
						class:hover:bg-grey-50={currentTab !== tab.id}
						onclick={() => goto(`${base}/app/find/${tab.id}`)}
					>
						<span
							class="material-icons-round text-base"
							class:text-violet-700={currentTab === tab.id}
							class:text-grey-500={currentTab !== tab.id}
						>{tab.icon}</span>
						{tab.label}
					</button>
				{/each}
			</div>

			<!-- Contextual filters -->
			{#if currentTab === 'people' || currentTab === 'companies'}
				<div class="min-h-0 flex-1 overflow-auto">
					<div class="p-4">
						<div class="text-grey-500 mb-3 text-xs font-semibold uppercase tracking-wider">
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
								<div class="text-grey-500 mb-3 text-xs font-semibold uppercase tracking-wider">Company</div>
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
				<div class="min-h-0 flex-1 overflow-auto p-4">
					<div class="text-grey-500 mb-3 text-xs font-semibold uppercase tracking-wider">Destination</div>
					<div class="border-grey-200 rounded-lg border p-3">
						<div class="text-grey-600 mb-2 text-xs font-medium">Save results to</div>
						<select class="input h-9 w-full text-sm">
							<option>Create new list...</option>
							<option>SaaS Founders Q1</option>
							<option>VP Sales Software</option>
							<option>Series B Startups</option>
						</select>
					</div>
					<div class="mt-4">
						<div class="text-grey-500 mb-3 text-xs font-semibold uppercase tracking-wider">Enrichment type</div>
						{#each [
							{ id: 'mix', label: 'Mix (Phone + Email)', icon: 'auto_awesome' },
							{ id: 'phone', label: 'Phone only', icon: 'phone' },
							{ id: 'email', label: 'Email only', icon: 'email' },
						] as type}
							<button class="text-grey-800 hover:bg-grey-50 flex h-10 w-full items-center gap-2.5 rounded-lg px-3 text-sm font-medium">
								<span class="material-icons-round text-grey-500 text-base">{type.icon}</span>
								{type.label}
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
</style>
