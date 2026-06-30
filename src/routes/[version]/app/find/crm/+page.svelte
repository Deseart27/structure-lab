<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	let base = $derived(`${svelteBase}/${$page.params.version}`);

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
</script>

<div class="flex h-full flex-col overflow-auto">
	<div class="border-grey-200 flex h-14 shrink-0 items-center border-b px-6">
		<h2 class="text-grey-900 text-base font-semibold">CRM Enrichment</h2>
	</div>

	<div class="flex-1 overflow-auto p-6">
		<p class="text-grey-600 mb-6 text-sm">Enrich contacts already in your CRM. Select a CRM source and pick lists to enrich. Results stay synced with your CRM and are also visible in Prospects.</p>

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
		<div>
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
							<button class="btn-ghost h-7 gap-1 px-2 text-xs">
								<span class="material-icons-round text-base">auto_awesome</span>
								Enrich
							</button>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
