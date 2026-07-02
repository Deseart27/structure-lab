<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';
	let base = $derived(`${svelteBase}/${$page.params.version}`);
	let version = $derived($page.params.version);

	let wantPhone = $state(true);
	let wantEmail = $state(true);
	let wantPersonalEmail = $state(false);
	let enrichExportPopoverId = $state('');

	const hubspotLists = [
		{ name: 'Marketing Qualified Leads', count: 1245, enriched: 890, lastEnriched: 'Jun 28, 2025' },
		{ name: 'Sales Pipeline Q1', count: 367, enriched: 367, lastEnriched: 'Jun 25, 2025' },
		{ name: 'New Signups June', count: 89, enriched: 0, lastEnriched: 'Never' },
		{ name: 'Enterprise Accounts', count: 45, enriched: 45, lastEnriched: 'Jun 20, 2025' },
	];

	const recentEnrichments = [
		{ id: 'cj1', list: 'Marketing Qualified Leads', listId: '1', contacts: 1245, found: 890, status: 'completed' as const, progress: 100, started: '2 days ago' },
		{ id: 'cj2', list: 'Sales Pipeline Q1', listId: '2', contacts: 367, found: 254, status: 'running' as const, progress: 69, started: '35 min ago' },
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

			<!-- Enrichment type checkboxes -->
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
				<label
					class="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2.5 rounded-xl border text-sm font-medium transition-all {wantPersonalEmail ? 'border-pink-300 bg-pink-50 text-pink-800 shadow-sm' : 'border-grey-200 text-grey-600 hover:border-grey-300'}"
				>
					<input type="checkbox" class="sr-only" bind:checked={wantPersonalEmail} />
					<span class="material-icons-round text-base">person</span>
					Personal Email
				</label>
			</div>

			<!-- Connected CRM -->
			<div class="mb-8">
				<div class="border-violet-200 flex items-center gap-4 rounded-xl border bg-violet-50 p-5">
					<span class="material-icons-round text-3xl" style:color="#ff7a59">hub</span>
					<div class="flex-1">
						<div class="flex items-center gap-2">
							<span class="text-grey-900 text-sm font-medium">HubSpot</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
								<span class="material-icons-round text-xs">check_circle</span>
								Connected
							</span>
						</div>
						<p class="text-grey-500 text-xs mt-0.5">12 lists &middot; Last synced: 2 hours ago</p>
					</div>
					<button class="btn-ghost h-8 px-3 text-xs">Manage</button>
				</div>
			</div>

			<!-- HubSpot Lists -->
			<div class="mb-8">
				<h3 class="text-grey-900 mb-4 text-base font-semibold">HubSpot Lists</h3>
				<div class="list-shell">
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

			<!-- Recent Enrichments -->
			<div class="mb-20">
				<div class="flex items-center justify-between">
					<h2 class="text-grey-900 text-lg font-semibold">Recent Enrichments</h2>
					<span class="text-grey-500 text-sm">{recentEnrichments.filter(e => e.status === 'running').length} running</span>
				</div>
				<div class="list-shell mt-4">
					{#each recentEnrichments as enrichment, i}
						<div
							class="hover:bg-grey-50 flex items-center gap-4 px-5 py-4 transition-colors"
							class:border-grey-100={i < recentEnrichments.length - 1}
							class:border-b={i < recentEnrichments.length - 1}
						>
							<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg {enrichment.status === 'running' ? 'bg-amber-50' : 'bg-emerald-50'}">
								<span class="material-icons-round text-lg {enrichment.status === 'running' ? 'text-amber-600' : 'text-emerald-600'}">
									{enrichment.status === 'running' ? 'sync' : 'check_circle'}
								</span>
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<p class="text-grey-900 truncate text-sm font-medium">{enrichment.list}</p>
									<span class="text-grey-400 text-xs">&middot;</span>
									<span class="text-grey-500 text-xs">HubSpot</span>
									<span class="text-grey-400 text-xs">&middot;</span>
									<span class="text-grey-500 text-xs">CRM Enrichment</span>
								</div>
								<div class="mt-1.5 flex items-center gap-3">
									<div class="bg-grey-200 h-1.5 w-32 overflow-hidden rounded-full">
										<div
											class="h-full rounded-full transition-all {enrichment.status === 'running' ? 'bg-amber-500' : 'bg-emerald-500'}"
											style:width="{enrichment.progress}%"
										></div>
									</div>
									<span class="text-grey-500 text-xs">{enrichment.found}/{enrichment.contacts} found</span>
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
								{:else}
									<span class="inline-flex h-6 items-center rounded-full bg-amber-50 px-2.5 text-xs font-medium text-amber-700">{enrichment.progress}%</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
