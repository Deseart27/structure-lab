<script lang="ts">
	import { page } from '$app/stores';
	import { base as svelteBase } from '$app/paths';
	import { toast } from '$lib/toast.svelte';
	import { v6Store } from '$lib/mock/v6.svelte';
	import ExportPopover, { pinnedExport } from '$lib/components/ExportPopover.svelte';
	let version = $derived($page.params.version);
	let v6ExportRef: ExportPopover;

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
	let v6RowListOpen = $state<string | null>(null);

	// Mock list membership for companies
	const v6CompanyListMembership: Record<string, string[]> = {
		'comp1': ['ABM - Fintech FR'],
		'comp3': ['ABM - Fintech FR'],
		'comp5': ['ABM - Fintech FR'],
		'comp8': ['ABM - Fintech FR'],
	};

	let v6CompanySessionAdds = $state<Record<string, string[]>>({});

	function v6GetCompanyLists(id: string): string[] {
		const base = v6CompanyListMembership[id] ?? [];
		const added = v6CompanySessionAdds[id] ?? [];
		return [...new Set([...base, ...added])];
	}

	function v6AddCompanyToList(id: string, listName: string, companyName: string) {
		const current = v6CompanySessionAdds[id] ?? [];
		if (!v6GetCompanyLists(id).includes(listName)) {
			v6CompanySessionAdds = { ...v6CompanySessionAdds, [id]: [...current, listName] };
		}
		v6RowListOpen = null;
		toast.show(`${companyName} added to ${listName}`);
	}

	// HubSpot push state per company
	const v6CompanyPushedToHS: Record<string, boolean> = { 'comp1': true, 'comp3': true };
	let v6CompanySessionPushed = $state(new Set<string>());

	function v6IsCompanyPushed(id: string): boolean {
		return v6CompanyPushedToHS[id] === true || v6CompanySessionPushed.has(id);
	}

	function v6PushCompanyToHS(id: string, name: string) {
		if (v6IsCompanyPushed(id)) return;
		const next = new Set(v6CompanySessionPushed);
		next.add(id);
		v6CompanySessionPushed = next;
		toast.show(`${name} pushed to HubSpot`);
	}
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
					<div class="relative flex items-center">
						<button
							class="btn-ghost h-8 gap-1.5 rounded-r-none border-r-0 px-3 text-sm"
							onclick={() => { v6ExportOpen = !v6ExportOpen; }}
						>
							<span class="material-icons-round text-grey-600 text-base">download</span>
							Export
							<span class="material-icons-round text-grey-400 text-sm">expand_more</span>
						</button>
						<button
							class="btn-ghost h-8 rounded-l-none border-l border-grey-200 px-2 text-sm"
							title={pinnedExport.method === 'hubspot' ? 'Quick: Push to HubSpot' : pinnedExport.method === 'csv' ? 'Quick: Export CSV' : 'Quick: Push to engagement tool'}
							onclick={() => v6ExportRef.runPinned()}
						>
							{#if pinnedExport.method === 'hubspot'}
								<svg class="h-4 w-4" viewBox="0 0 1024 1024">
									<circle cx="512" cy="512" r="512" fill="#FF7A59"/>
									<path d="M623.8 624.94c-38.23 0-69.24-30.67-69.24-68.51s31-68.52 69.24-68.52 69.26 30.67 69.26 68.52-31 68.51-69.26 68.51m20.74-200.42v-61a46.83 46.83 0 0 0 27.33-42.29v-1.41c0-25.78-21.32-46.86-47.35-46.86h-1.43c-26 0-47.35 21.09-47.35 46.86v1.41a46.85 46.85 0 0 0 27.33 42.29v61a135.08 135.08 0 0 0-63.86 27.79l-169.1-130.17A52.49 52.49 0 0 0 372 309c0-29.21-23.89-52.92-53.4-53s-53.45 23.59-53.48 52.81 23.85 52.88 53.36 52.93a53.29 53.29 0 0 0 26.33-7.09l166.38 128.1a132.14 132.14 0 0 0 2.07 150.3l-50.62 50.1A43.42 43.42 0 1 0 450.1 768c24.24 0 43.9-19.46 43.9-43.45a42.24 42.24 0 0 0-2-12.42l50-49.52a135.28 135.28 0 0 0 81.8 27.47c74.61 0 135.06-59.83 135.06-133.65 0-66.82-49.62-122-114.33-131.91" fill="#fff" fill-rule="evenodd"/>
								</svg>
							{:else if pinnedExport.method === 'csv'}
								<span class="material-icons-round text-grey-600 text-base">description</span>
							{:else}
								<span class="material-icons-round text-grey-600 text-base">campaign</span>
							{/if}
						</button>
						<ExportPopover bind:this={v6ExportRef} bind:open={v6ExportOpen} context="companies" count={v6Selected.size} />
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
						<th class="w-10 px-2 py-3"></th>
						<th class="w-8 px-1 py-3"></th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Industry</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Headcount</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Website</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Funding</th>
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each v6Companies as company (company.id)}
					{@const compLists = v6GetCompanyLists(company.id)}
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
							<!-- Quick add to list -->
							<td class="px-2 py-3">
								<div class="relative">
									<button
										class="flex h-7 w-7 items-center justify-center rounded-lg transition-colors {compLists.length > 0 ? 'text-blue-500 hover:bg-blue-50 hover:text-blue-700' : 'text-grey-500 hover:bg-grey-100 hover:text-grey-700'}"
										title={compLists.length > 0 ? `In: ${compLists.join(', ')}` : 'Add to list'}
										onclick={() => { v6RowListOpen = v6RowListOpen === company.id ? null : company.id; }}
									>
										<span class="material-icons-round text-base">{compLists.length > 0 ? 'playlist_add_check' : 'playlist_add'}</span>
									</button>
									{#if v6RowListOpen === company.id}
										<button class="fixed inset-0 z-30" onclick={() => { v6RowListOpen = null; }} aria-label="Close"></button>
										<div class="absolute left-0 top-full z-40 mt-1 w-52 rounded-xl border border-grey-200 bg-white p-1.5 shadow-lg">
											{#each v6CompanyLists as list}
												{@const isIn = compLists.includes(list.name)}
												<button
													class="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm {isIn ? 'text-blue-700 bg-blue-50' : 'text-grey-800 hover:bg-grey-50'}"
													onclick={() => { if (!isIn) v6AddCompanyToList(company.id, list.name, company.name); else { v6RowListOpen = null; } }}
												>
													<span class="material-icons-round text-sm {isIn ? 'text-blue-500' : 'text-grey-400'}">{isIn ? 'check_circle' : 'radio_button_unchecked'}</span>
													{list.name}
												</button>
											{/each}
											<div class="my-1 border-t border-grey-100"></div>
											<button
												class="hover:bg-grey-50 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-blue-700"
												onclick={() => { v6RowListOpen = null; toast.show('New list created'); }}
											>
												<span class="material-icons-round text-sm">add</span>
												Create new list
											</button>
										</div>
									{/if}
								</div>
							</td>
							<!-- Push to HubSpot -->
							<td class="px-1 py-3">
								<button
									class="flex h-7 w-7 items-center justify-center rounded-lg transition-colors {v6IsCompanyPushed(company.id) ? 'opacity-100' : 'opacity-40 hover:opacity-70'}"
									title={v6IsCompanyPushed(company.id) ? 'Already in HubSpot' : 'Push to HubSpot'}
									onclick={() => v6PushCompanyToHS(company.id, company.name)}
								>
									<svg class="h-3.5 w-3.5" viewBox="0 0 1024 1024">
										<circle cx="512" cy="512" r="512" fill={v6IsCompanyPushed(company.id) ? '#FF7A59' : '#9CA3AF'}/>
										<path d="M623.8 624.94c-38.23 0-69.24-30.67-69.24-68.51s31-68.52 69.24-68.52 69.26 30.67 69.26 68.52-31 68.51-69.26 68.51m20.74-200.42v-61a46.83 46.83 0 0 0 27.33-42.29v-1.41c0-25.78-21.32-46.86-47.35-46.86h-1.43c-26 0-47.35 21.09-47.35 46.86v1.41a46.85 46.85 0 0 0 27.33 42.29v61a135.08 135.08 0 0 0-63.86 27.79l-169.1-130.17A52.49 52.49 0 0 0 372 309c0-29.21-23.89-52.92-53.4-53s-53.45 23.59-53.48 52.81 23.85 52.88 53.36 52.93a53.29 53.29 0 0 0 26.33-7.09l166.38 128.1a132.14 132.14 0 0 0 2.07 150.3l-50.62 50.1A43.42 43.42 0 1 0 450.1 768c24.24 0 43.9-19.46 43.9-43.45a42.24 42.24 0 0 0-2-12.42l50-49.52a135.28 135.28 0 0 0 81.8 27.47c74.61 0 135.06-59.83 135.06-133.65 0-66.82-49.62-122-114.33-131.91" fill="#fff" fill-rule="evenodd"/>
									</svg>
								</button>
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
