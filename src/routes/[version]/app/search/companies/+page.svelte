<script lang="ts">
	import { page } from '$app/stores';
	import { base as svelteBase } from '$app/paths';
	import { toast } from '$lib/toast.svelte';
	import { v6Store } from '$lib/mock/v6.svelte';
	import ExportPopover from '$lib/components/ExportPopover.svelte';
	let version = $derived($page.params.version);

	let showExportPopover = $state(false);

	const companies = [
		{ name: 'Stripe', location: 'San Francisco, US', headcount: 8000, industry: 'Financial Technology', yearFounded: 2010, type: 'Private' },
		{ name: 'HubSpot', location: 'Boston, US', headcount: 7400, industry: 'Software', yearFounded: 2006, type: 'Public' },
		{ name: 'Datadog', location: 'New York, US', headcount: 5500, industry: 'Cloud Computing', yearFounded: 2010, type: 'Public' },
		{ name: 'Notion', location: 'San Francisco, US', headcount: 800, industry: 'Software', yearFounded: 2013, type: 'Private' },
		{ name: 'Factorial', location: 'Barcelona, Spain', headcount: 1200, industry: 'HR Technology', yearFounded: 2016, type: 'Private' },
		{ name: 'Figma', location: 'San Francisco, US', headcount: 1500, industry: 'Design Software', yearFounded: 2012, type: 'Private' },
		{ name: 'Aircall', location: 'Paris, France', headcount: 900, industry: 'Telecommunications', yearFounded: 2014, type: 'Private' },
		{ name: 'Personio', location: 'Munich, Germany', headcount: 2000, industry: 'HR Technology', yearFounded: 2015, type: 'Private' },
		{ name: 'Klarna', location: 'Stockholm, Sweden', headcount: 5000, industry: 'Financial Technology', yearFounded: 2005, type: 'Private' },
		{ name: 'Canva', location: 'Sydney, Australia', headcount: 4000, industry: 'Design Software', yearFounded: 2012, type: 'Private' },
		{ name: 'Miro', location: 'Amsterdam, Netherlands', headcount: 1800, industry: 'Software', yearFounded: 2011, type: 'Private' },
		{ name: 'Deel', location: 'San Francisco, US', headcount: 3000, industry: 'HR Technology', yearFounded: 2019, type: 'Private' },
	];

	// V6 state
	let v6Companies = $derived(v6Store.companies);
	let v6Selected = $state<Set<string>>(new Set());
	let v6ExportOpen = $state(false);

	function v6ToggleAll(checked: boolean) {
		v6Selected = checked ? new Set(v6Companies.map(c => c.id)) : new Set();
	}

	function v6ToggleRow(id: string, checked: boolean) {
		const next = new Set(v6Selected);
		if (checked) next.add(id); else next.delete(id);
		v6Selected = next;
	}

	let v6AllChecked = $derived(v6Companies.length > 0 && v6Selected.size === v6Companies.length);
	let v6SomeChecked = $derived(v6Selected.size > 0);
	let v6CompanyLists = $derived(v6Store.lists.filter(l => l.type === 'company'));
</script>

<div class="flex h-full flex-col">
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h2 class="text-grey-900 text-base font-semibold">{version === 'v6' ? v6Companies.length : companies.length} companies</h2>
		</div>
		<div class="flex items-center gap-2">
			{#if version === 'v4'}
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Companies saved to list')}>
					<span class="material-icons-round text-grey-600 text-base">playlist_add</span>
					Save to list
				</button>
				<div class="relative">
					<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => { showExportPopover = !showExportPopover; }}>
						<span class="material-icons-round text-grey-600 text-base">download</span>
						Export
						<span class="material-icons-round text-grey-400 text-sm">expand_more</span>
					</button>
					{#if showExportPopover}
						<div class="absolute right-0 top-10 z-20 w-52 rounded-xl border border-grey-200 bg-white p-1.5 shadow-lg">
							<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800" onclick={() => { showExportPopover = false; toast.show('Companies pushed to HubSpot'); }}>
								<span class="material-icons-round text-base" style="color: #ff7a59;">hub</span>
								Push to CRM
							</button>
							<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800" onclick={() => { showExportPopover = false; toast.show('CSV download started'); }}>
								<span class="material-icons-round text-grey-500 text-base">description</span>
								Export CSV
							</button>
							<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800" onclick={() => { showExportPopover = false; toast.show('Pushed to Outreach'); }}>
								<span class="material-icons-round text-grey-500 text-base">campaign</span>
								Push to engagement tool
							</button>
						</div>
					{/if}
				</div>
				<button class="btn-primary h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Finding employees...')}>
					<span class="material-icons-round text-sm text-white">group</span>
					Find employees
				</button>
			{:else if version === 'v6'}
				{#if v6SomeChecked}
					<span class="text-grey-500 text-sm">{v6Selected.size} selected</span>
					<button
						class="btn-ghost h-8 gap-1.5 px-3 text-sm"
						onclick={() => {
							const names = v6CompanyLists.map(l => l.name).join(', ') || 'company list';
							toast.show(`${v6Selected.size} ${v6Selected.size === 1 ? 'company' : 'companies'} added to ${names}`);
						}}
					>
						<span class="material-icons-round text-grey-600 text-base">playlist_add</span>
						Add to list
					</button>
					<div class="relative">
						<button
							class="btn-ghost h-8 gap-1.5 px-3 text-sm"
							onclick={() => { v6ExportOpen = !v6ExportOpen; }}
						>
							<span class="material-icons-round text-grey-600 text-base">download</span>
							Export
							<span class="material-icons-round text-grey-400 text-sm">expand_more</span>
						</button>
						<ExportPopover bind:open={v6ExportOpen} context="companies" count={v6Selected.size} />
					</div>
					<button
						class="btn-primary h-8 gap-1.5 px-3 text-sm"
						onclick={() => {
							const names = [...v6Selected].map(id => v6Companies.find(c => c.id === id)?.name).filter(Boolean).join(', ');
							toast.show(`Filtered people search on ${names}`);
						}}
					>
						<span class="material-icons-round text-sm text-white">group</span>
						Find employees
					</button>
				{/if}
			{:else}
				{#if version !== 'v2' && version !== 'v3'}
					<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Export started — CSV will download shortly')}>
						<span class="material-icons-round text-grey-600 text-base">download</span>
						Export
					</button>
				{/if}
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Companies saved to list')}>
					<span class="material-icons-round text-grey-600 text-base">playlist_add</span>
					{version === 'v2' || version === 'v3' ? 'Save to list' : 'Add to list'}
				</button>
				{#if version === 'v2' || version === 'v3'}
					<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" style="color: #ff7a59;" onclick={() => toast.show('Companies pushed to HubSpot')}>
						<span class="material-icons-round text-base">hub</span>
						Push to HubSpot
					</button>
				{/if}
				<button class="btn-primary h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Finding employees...')}>
					<span class="material-icons-round text-sm text-white">group</span>
					Find employees
				</button>
			{/if}
		</div>
	</div>

	<div class="bg-grey-50 flex-1 overflow-auto">
		{#if version === 'v6'}
			<table class="w-full min-w-[800px]">
				<thead class="sticky top-0 z-10">
					<tr class="table-header">
						<th class="w-12 px-4 py-3">
							<input
								type="checkbox"
								checked={v6AllChecked}
								indeterminate={v6SomeChecked && !v6AllChecked}
								onchange={(e) => v6ToggleAll((e.target as HTMLInputElement).checked)}
							/>
						</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Industry</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Headcount</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Website</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Funding</th>
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each v6Companies as company (company.id)}
						<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
							<td class="px-4 py-3">
								<input
									type="checkbox"
									checked={v6Selected.has(company.id)}
									onchange={(e) => v6ToggleRow(company.id, (e.target as HTMLInputElement).checked)}
								/>
							</td>
							<td class="px-4 py-3 text-sm font-medium">
								<a
									href="{svelteBase}/v6/app/search/companies/{company.id}"
									class="text-violet-700 hover:underline"
								>{company.name}</a>
							</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{company.industry}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{company.headcount.toLocaleString()}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{company.location}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{company.domain}</td>
							<td class="px-4 py-3 text-sm">
								{#if company.fundingUnlocked}
									<span class="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
										<span class="material-icons-round text-xs">attach_money</span>
										Funded
									</span>
								{:else}
									<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-xs font-medium text-grey-500">
										<span class="material-icons-round text-xs">lock</span>
										Locked
									</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<table class="w-full min-w-[800px]">
				<thead class="sticky top-0 z-10">
					<tr class="table-header">
						<th class="w-12 px-4 py-3"><input type="checkbox" /></th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Headcount</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Industry</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Year founded</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Type</th>
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each companies as company}
						<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
							<td class="px-4 py-3"><input type="checkbox" /></td>
							<td class="text-grey-900 px-4 py-3 text-sm font-medium">{company.name}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{company.location}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{company.headcount.toLocaleString()}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{company.industry}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{company.yearFounded}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{company.type}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>
</div>
