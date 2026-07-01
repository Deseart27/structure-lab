<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';
	let base = $derived(`${svelteBase}/${$page.params.version}`);

	let enrichType: 'mix' | 'phone' | 'email' = $state('mix');

	const crmSources = [
		{ name: 'HubSpot', icon: 'hub', color: '#ff7a59', connected: true, lists: 12, lastSync: '2 hours ago' },
		{ name: 'Salesforce', icon: 'cloud', color: '#00a1e0', connected: false, lists: 0, lastSync: '' },
		{ name: 'Pipedrive', icon: 'filter_alt', color: '#1a7a3c', connected: false, lists: 0, lastSync: '' },
	];

	const hubspotLists = [
		{ name: 'Marketing Qualified Leads', count: 1245, enriched: 890, lastEnriched: 'Jun 28, 2025' },
		{ name: 'Sales Pipeline Q1', count: 367, enriched: 367, lastEnriched: 'Jun 25, 2025' },
		{ name: 'New Signups June', count: 89, enriched: 0, lastEnriched: 'Never' },
		{ name: 'Enterprise Accounts', count: 45, enriched: 45, lastEnriched: 'Jun 20, 2025' },
	];

	const crmJobs = [
		{ id: 'cj1', list: 'Marketing Qualified Leads', listId: '1', source: 'HubSpot', contacts: 1245, found: 890, status: 'completed' as const, progress: 100, started: '2 days ago' },
		{ id: 'cj2', list: 'Sales Pipeline Q1', listId: '2', source: 'HubSpot', contacts: 367, found: 254, status: 'running' as const, progress: 69, started: '35 min ago' },
	];
</script>

<div class="flex h-full flex-col overflow-auto">
	<div class="flex justify-center pt-20">
		<div class="mx-8 w-full max-w-[1050px]">
			<div class="flex items-start justify-between pb-6">
				<div>
					<h1 class="text-grey-900 text-2xl font-semibold">CRM Enrichment</h1>
					<p class="text-grey-600 mt-1 text-sm">Enrich contacts already in your CRM with emails, phones, and B2B data.</p>
				</div>
			</div>

			<!-- Enrichment type selector -->
			<div class="mb-6 flex gap-3">
				{#each [
					{ id: 'mix', label: 'Mix', icon: 'auto_awesome' },
					{ id: 'phone', label: 'Phone', icon: 'phone' },
					{ id: 'email', label: 'Email', icon: 'email' },
				] as type}
					<button
						class="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors"
						class:border-violet-200={enrichType === type.id}
						class:bg-violet-50={enrichType === type.id}
						class:text-violet-800={enrichType === type.id}
						class:border-grey-200={enrichType !== type.id}
						class:text-grey-700={enrichType !== type.id}
						onclick={() => { enrichType = type.id as typeof enrichType; }}
					>
						<span class="material-icons-round text-base">{type.icon}</span>
						{type.label}
					</button>
				{/each}
			</div>

			<!-- CRM Sources -->
			<div class="mb-8 grid grid-cols-3 gap-4">
				{#each crmSources as crm}
					<div
						class="border-grey-200 flex cursor-pointer flex-col items-center gap-3 rounded-xl border p-5 transition-colors {crm.connected ? 'border-violet-200 bg-violet-50' : 'hover:border-grey-300'}"
					>
						<span class="material-icons-round text-3xl" style:color={crm.color}>{crm.icon}</span>
						<span class="text-grey-900 text-sm font-medium">{crm.name}</span>
						{#if crm.connected}
							<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
								<span class="material-icons-round text-xs">check_circle</span>
								Connected
							</span>
						{:else}
							<button class="btn-ghost h-7 px-2 text-xs">Connect</button>
						{/if}
					</div>
				{/each}
			</div>

			<!-- HubSpot Lists -->
			<div class="mb-8">
				<div class="mb-4 flex items-center justify-between">
					<h3 class="text-grey-900 text-base font-semibold">HubSpot Lists</h3>
					<span class="text-grey-500 text-sm">Last synced: 2 hours ago</span>
				</div>

				<div class="border-grey-200 overflow-hidden rounded-xl border">
					{#each hubspotLists as list, i}
						<div
							class="hover:bg-grey-50 flex items-center justify-between px-5 py-4 transition-colors"
							class:border-grey-100={i < hubspotLists.length - 1}
							class:border-b={i < hubspotLists.length - 1}
						>
							<div class="flex items-center gap-4">
								<input type="checkbox" />
								<div>
									<p class="text-grey-900 text-sm font-medium">{list.name}</p>
									<p class="text-grey-500 text-xs">{list.count.toLocaleString()} contacts &middot; Last enriched: {list.lastEnriched}</p>
								</div>
							</div>
							<div class="flex items-center gap-4">
								{#if list.enriched > 0}
									<div class="flex items-center gap-2">
										<div class="bg-grey-200 h-1.5 w-16 overflow-hidden rounded-full">
											<div class="h-full rounded-full bg-emerald-500" style:width="{Math.round((list.enriched / list.count) * 100)}%"></div>
										</div>
										<span class="text-grey-600 text-xs">{Math.round((list.enriched / list.count) * 100)}%</span>
									</div>
								{/if}
								<button class="btn-ghost h-7 gap-1 px-2 text-xs" onclick={() => toast.show(`Enriching "${list.name}"...`)}>
									<span class="material-icons-round text-base">auto_awesome</span>
									Enrich
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Recent Jobs -->
			<div class="mb-20">
				<div class="flex items-center justify-between">
					<h2 class="text-grey-900 text-lg font-semibold">Recent Jobs</h2>
					<span class="text-grey-500 text-sm">{crmJobs.filter(j => j.status === 'running').length} running</span>
				</div>
				<div class="border-grey-200 mt-4 overflow-hidden rounded-xl border">
					{#each crmJobs as job, i}
						<div
							class="hover:bg-grey-50 flex items-center gap-4 px-5 py-4 transition-colors"
							class:border-grey-100={i < crmJobs.length - 1}
							class:border-b={i < crmJobs.length - 1}
						>
							<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg {job.status === 'running' ? 'bg-amber-50' : 'bg-emerald-50'}">
								<span class="material-icons-round text-lg {job.status === 'running' ? 'text-amber-600' : 'text-emerald-600'}">
									{job.status === 'running' ? 'sync' : 'check_circle'}
								</span>
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<p class="text-grey-900 truncate text-sm font-medium">{job.list}</p>
									<span class="text-grey-400 text-xs">&middot;</span>
									<span class="text-grey-500 text-xs">{job.source}</span>
									<span class="text-grey-400 text-xs">&middot;</span>
									<span class="text-grey-500 text-xs">CRM Enrichment</span>
								</div>
								<div class="mt-1.5 flex items-center gap-3">
									<div class="bg-grey-200 h-1.5 w-32 overflow-hidden rounded-full">
										<div
											class="h-full rounded-full transition-all {job.status === 'running' ? 'bg-amber-500' : 'bg-emerald-500'}"
											style:width="{job.progress}%"
										></div>
									</div>
									<span class="text-grey-500 text-xs">{job.found}/{job.contacts} found</span>
								</div>
							</div>
							<div class="flex shrink-0 items-center gap-3">
								<span class="text-grey-400 text-xs">{job.started}</span>
								{#if job.status === 'completed'}
									<a href="{base}/app/prospects/{job.listId}" class="btn-ghost flex h-7 items-center gap-1 px-2 text-xs text-violet-700">
										View in Lists
										<span class="material-icons-round text-sm">arrow_forward</span>
									</a>
								{:else}
									<span class="inline-flex h-6 items-center rounded-full bg-amber-50 px-2.5 text-xs font-medium text-amber-700">{job.progress}%</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
