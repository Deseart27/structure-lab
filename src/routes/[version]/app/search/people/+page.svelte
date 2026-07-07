<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';
	import { v6Store } from '$lib/mock/v6.svelte';
	import ExportPopover, { pinnedExport } from '$lib/components/ExportPopover.svelte';
	let version = $derived($page.params.version);
	let v6ExportRef: ExportPopover;

	let showExportPopover = $state(false);

	const people = [
		{ name: 'Sarah Chen', title: 'VP of Sales', company: 'Stripe', location: 'San Francisco, US', headcount: 8000, industry: 'Financial Technology' },
		{ name: 'James Rodriguez', title: 'Head of Marketing', company: 'HubSpot', location: 'Boston, US', headcount: 7400, industry: 'Software' },
		{ name: 'Emma Dubois', title: 'CTO', company: 'Datadog', location: 'Paris, France', headcount: 5500, industry: 'Cloud Computing' },
		{ name: 'Michael Park', title: 'Director of Engineering', company: 'Notion', location: 'New York, US', headcount: 800, industry: 'Software' },
		{ name: 'Laura Bianchi', title: 'CEO', company: 'Factorial', location: 'Barcelona, Spain', headcount: 1200, industry: 'HR Technology' },
		{ name: 'David Kim', title: 'VP of Product', company: 'Figma', location: 'San Francisco, US', headcount: 1500, industry: 'Design Software' },
		{ name: 'Sophie Martin', title: 'Sales Director', company: 'Aircall', location: 'Paris, France', headcount: 900, industry: 'Telecommunications' },
		{ name: 'Alex Thompson', title: 'Head of Growth', company: 'Loom', location: 'San Francisco, US', headcount: 300, industry: 'Software' },
		{ name: 'Maria Garcia', title: 'CMO', company: 'Typeform', location: 'Barcelona, Spain', headcount: 450, industry: 'Software' },
		{ name: 'Thomas Weber', title: 'VP Engineering', company: 'Personio', location: 'Munich, Germany', headcount: 2000, industry: 'HR Technology' },
		{ name: 'Olivia Brown', title: 'Director of Sales', company: 'Gong', location: 'San Francisco, US', headcount: 1800, industry: 'Software' },
		{ name: 'Lucas Moreau', title: 'COO', company: 'Spendesk', location: 'Paris, France', headcount: 400, industry: 'Financial Technology' },
		{ name: 'Priya Sharma', title: 'VP of Marketing', company: 'Freshworks', location: 'Chennai, India', headcount: 5200, industry: 'Software' },
		{ name: 'Henrik Johansson', title: 'CRO', company: 'Klarna', location: 'Stockholm, Sweden', headcount: 5000, industry: 'Financial Technology' },
		{ name: 'Rachel Lee', title: 'Head of Product', company: 'Canva', location: 'Sydney, Australia', headcount: 4000, industry: 'Design Software' },
	];

	// --- V6 state ---

	// Mock email/phone generators for inline enrichment
	function mockEmail(name: string, company: string): string {
		const parts = name.toLowerCase().split(' ');
		const domain = company.toLowerCase().replace(/\s+/g, '') + '.com';
		return `${parts[0]}.${parts[1] ?? parts[0]}@${domain}`;
	}

	function mockPhone(index: number): string {
		const suffixes = ['12 34 56 78', '98 76 54 32', '11 22 33 44', '55 44 33 22', '66 55 44 33', '77 88 99 00', '22 33 44 55', '33 44 55 66', '44 55 66 77', '55 66 77 88', '66 77 88 99', '77 99 11 22', '88 11 22 33', '99 22 33 44', '12 99 88 77'];
		return `+33 6 ${suffixes[index % suffixes.length]}`;
	}

	let v6Selected = $state(new Set<number>());
	let v6Enriched = $state(new Set<number>());
	let v6Enriching = $state(new Set<number>());

	let v6ExportOpen = $state(false);
	let v6AddToListOpen = $state(false);
	let v6EnrichModalOpen = $state(false);
	let v6RowListOpen = $state<number | null>(null);

	// Mock list membership — some contacts are already in lists
	const v6ListMembership: Record<number, string[]> = {
		0: ['Q3 Targets'],
		2: ['Q3 Targets', 'Sales Leaders DACH'],
		4: ['Q3 Targets'],
		6: ['Webinar attendees'],
		9: ['Sales Leaders DACH'],
	};

	// Track additions during the session
	let v6SessionListAdds = $state<Record<number, string[]>>({});

	function v6GetLists(i: number): string[] {
		const base = v6ListMembership[i] ?? [];
		const added = v6SessionListAdds[i] ?? [];
		return [...new Set([...base, ...added])];
	}

	function v6AddRowToList(i: number, listName: string, personName: string) {
		const current = v6SessionListAdds[i] ?? [];
		if (!v6GetLists(i).includes(listName)) {
			v6SessionListAdds = { ...v6SessionListAdds, [i]: [...current, listName] };
		}
		v6RowListOpen = null;
		toast.show(`${personName} added to ${listName}`);
	}

	// Batch enrich modal state
	let v6ModalEmailPro = $state(true);
	let v6ModalPhone = $state(true);
	let v6ModalPersonalEmail = $state(false);
	let v6ModalList = $state('none');

	function v6ToggleAll(checked: boolean) {
		if (checked) {
			v6Selected = new Set(people.map((_, i) => i));
		} else {
			v6Selected = new Set();
		}
	}

	function v6ToggleRow(i: number, checked: boolean) {
		const next = new Set(v6Selected);
		if (checked) next.add(i); else next.delete(i);
		v6Selected = next;
	}

	function v6EnrichRow(i: number) {
		if (v6Enriching.has(i) || v6Enriched.has(i)) return;
		const next = new Set(v6Enriching);
		next.add(i);
		v6Enriching = next;
		setTimeout(() => {
			const enriching = new Set(v6Enriching);
			enriching.delete(i);
			v6Enriching = enriching;
			const enriched = new Set(v6Enriched);
			enriched.add(i);
			v6Enriched = enriched;
			toast.show('Contact enriched — logged in Enrichment');
		}, 2500);
	}

	function v6LaunchBatchEnrich() {
		const count = v6Selected.size;
		v6EnrichModalOpen = false;
		toast.show(`Enrichment started — ${count} contacts`);
	}

	function v6AddToList(listName: string) {
		const count = v6Selected.size;
		v6AddToListOpen = false;
		toast.show(`${count} added to ${listName}`);
	}

	$effect(() => {
		// Close add-to-list popover when selection clears
		if (v6Selected.size === 0) v6AddToListOpen = false;
	});
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h2 class="text-grey-900 text-base font-semibold">{people.length} people</h2>
		</div>
		<div class="flex items-center gap-2">
			{#if version === 'v4'}
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Contacts added to list')}>
					<span class="material-icons-round text-grey-600 text-base">playlist_add</span>
					Add to list
				</button>
				<div class="relative">
					<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => { showExportPopover = !showExportPopover; }}>
						<span class="material-icons-round text-grey-600 text-base">download</span>
						Export
						<span class="material-icons-round text-grey-400 text-sm">expand_more</span>
					</button>
					{#if showExportPopover}
						<div class="absolute right-0 top-10 z-20 w-52 rounded-xl border border-grey-200 bg-white p-1.5 shadow-lg">
							<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800" onclick={() => { showExportPopover = false; toast.show('Contacts pushed to HubSpot'); }}>
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
				<button class="btn-primary h-8 gap-1 px-3 text-sm" onclick={() => toast.show('Enrichment started — added to "SaaS Founders Q1"')}>
					<span class="material-icons-round text-sm text-white">auto_awesome</span>
					Enrich
				</button>
			{:else if version === 'v6'}
				{#if v6Selected.size > 0}
					<span class="text-grey-500 mr-1 text-sm">{v6Selected.size} selected</span>
				{/if}

				<!-- Add to list — disabled when no selection -->
				<div class="relative">
					<button
						class="btn-ghost h-8 gap-1.5 px-3 text-sm"
						disabled={v6Selected.size === 0}
						onclick={() => { v6AddToListOpen = !v6AddToListOpen; v6ExportOpen = false; }}
					>
						<span class="material-icons-round text-grey-600 text-base">playlist_add</span>
						Add to list
						<span class="material-icons-round text-grey-400 text-sm">expand_more</span>
					</button>
					{#if v6AddToListOpen}
						<button class="fixed inset-0 z-30" onclick={() => { v6AddToListOpen = false; }} aria-label="Close"></button>
						<div class="absolute right-0 top-full z-40 mt-1 w-52 rounded-xl border border-grey-200 bg-white p-1.5 shadow-lg">
							{#each v6Store.lists.filter(l => l.type === 'people') as list}
								<button
									class="hover:bg-grey-50 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-grey-800"
									onclick={() => v6AddToList(list.name)}
								>
									<span class="material-icons-round text-grey-400 text-base">list</span>
									{list.name}
								</button>
							{/each}
							<div class="my-1 border-t border-grey-100"></div>
							<button
								class="hover:bg-grey-50 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-violet-700"
								onclick={() => { v6AddToListOpen = false; toast.show('New list created'); }}
							>
								<span class="material-icons-round text-base">add</span>
								Create new list
							</button>
						</div>
					{/if}
				</div>

				<!-- Export — always active -->
				<div class="relative flex items-center">
					<button
						class="btn-ghost h-8 gap-1.5 rounded-r-none border-r-0 px-3 text-sm"
						onclick={() => { v6ExportOpen = !v6ExportOpen; v6AddToListOpen = false; }}
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
					<ExportPopover bind:this={v6ExportRef} bind:open={v6ExportOpen} context="people" count={v6Selected.size || people.length} sourceName="VP Sales · SaaS · France" />
				</div>

				<!-- Enrich — always active -->
				<button
					class="btn-primary h-8 gap-1 px-3 text-sm"
					onclick={() => { if (v6Selected.size > 0) { v6EnrichModalOpen = true; } else { toast.show('Select contacts to enrich'); } }}
				>
					<span class="material-icons-round text-sm text-white">auto_awesome</span>
					Enrich
				</button>
			{:else}
				{#if version !== 'v2' && version !== 'v3'}
					<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Export started — CSV will download shortly')}>
						<span class="material-icons-round text-grey-600 text-base">download</span>
						Export
					</button>
				{/if}
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Contacts saved to list')}>
					<span class="material-icons-round text-grey-600 text-base">playlist_add</span>
					{version === 'v2' || version === 'v3' ? 'Save to list' : 'Add to list'}
				</button>
				{#if version === 'v2' || version === 'v3'}
					<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" style="color: #ff7a59;" onclick={() => toast.show('Contacts pushed to HubSpot')}>
						<span class="material-icons-round text-base">hub</span>
						Push to HubSpot
					</button>
				{/if}
				<button class="btn-primary h-8 gap-1 px-3 text-sm" onclick={() => toast.show('Enrichment started — 15 contacts')}>
					<span class="material-icons-round text-sm text-white">auto_awesome</span>
					Enrich
				</button>
			{/if}
		</div>
	</div>

	{#if version === 'v6'}
		<!-- V6 search query chip -->
		<div class="border-grey-100 flex shrink-0 items-center gap-2 border-b px-6 py-2.5">
			<span class="text-grey-500 text-xs font-semibold uppercase tracking-wider">Search</span>
			<span class="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-0.5 text-xs font-medium text-violet-700">
				<span class="material-icons-round text-xs">search</span>
				VP Sales · SaaS · France
				<button class="ml-0.5 text-violet-400 hover:text-violet-700" onclick={() => toast.show('Filter removed')} aria-label="Remove filter">
					<span class="material-icons-round text-xs">close</span>
				</button>
			</span>
			<span class="text-grey-400 text-xs">{people.length} results</span>
		</div>

		<!-- V6 Table -->
		<div class="bg-grey-50 flex-1 overflow-auto">
			<table class="w-full min-w-[1100px]">
				<thead class="sticky top-0 z-10">
					<tr class="table-header">
						<th class="w-10 px-4 py-3">
							<input
								type="checkbox"
								checked={v6Selected.size === people.length}
								indeterminate={v6Selected.size > 0 && v6Selected.size < people.length}
								onchange={(e) => v6ToggleAll((e.target as HTMLInputElement).checked)}
							/>
						</th>
						<th class="w-8 px-2 py-3"></th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Job title</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
						<th class="w-10 px-2 py-3"></th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Industry</th>
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each people as person, i}
					{@const rowLists = v6GetLists(i)}
						<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors" class:bg-violet-50={v6Selected.has(i)}>
							<td class="px-4 py-3">
								<input
									type="checkbox"
									checked={v6Selected.has(i)}
									onchange={(e) => v6ToggleRow(i, (e.target as HTMLInputElement).checked)}
								/>
							</td>
							<!-- LinkedIn icon -->
							<td class="px-2 py-3">
								<a
									href="https://linkedin.com"
									target="_blank"
									rel="noopener noreferrer"
									class="flex items-center justify-center text-[#0A66C2] opacity-70 hover:opacity-100 transition-opacity"
									onclick={(e) => { e.preventDefault(); toast.show('Opening LinkedIn profile'); }}
									aria-label="LinkedIn profile"
								>
									<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
										<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
									</svg>
								</a>
							</td>
							<td class="text-grey-900 px-4 py-3 text-sm font-medium">{person.name}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{person.title}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{person.company}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{person.location}</td>
							<!-- Email -->
							<td class="px-4 py-3 text-sm">
								{#if v6Enriched.has(i)}
									<span class="text-grey-800 font-mono text-xs">{mockEmail(person.name, person.company)}</span>
								{:else if v6Enriching.has(i)}
									<span class="inline-flex items-center gap-1.5 text-xs text-grey-400">
										<svg class="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
										</svg>
										Finding…
									</span>
								{:else}
									<button
										class="flex h-7 items-center gap-1 rounded-lg border border-grey-200 bg-white px-2 text-xs font-medium text-grey-600 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
										onclick={() => v6EnrichRow(i)}
									>
										<span class="material-icons-round text-sm">mail</span>
										Find email
									</button>
								{/if}
							</td>
							<!-- Phone -->
							<td class="px-4 py-3 text-sm">
								{#if v6Enriched.has(i)}
									<span class="text-grey-800 font-mono text-xs">{mockPhone(i)}</span>
								{:else if v6Enriching.has(i)}
									<span class="inline-flex items-center gap-1.5 text-xs text-grey-400">
										<svg class="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
											<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
											<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
										</svg>
										Finding…
									</span>
								{:else}
									<button
										class="flex h-7 items-center gap-1 rounded-lg border border-grey-200 bg-white px-2 text-xs font-medium text-grey-600 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
										onclick={() => v6EnrichRow(i)}
									>
										<span class="material-icons-round text-sm">phone</span>
										Find phone
									</button>
								{/if}
							</td>
							<!-- Quick add to list -->
							<td class="px-2 py-3">
								<div class="relative">
									<button
										class="flex h-7 w-7 items-center justify-center rounded-lg transition-colors {rowLists.length > 0 ? 'text-violet-500 hover:bg-violet-50 hover:text-violet-700' : 'text-grey-500 hover:bg-grey-100 hover:text-grey-700'}"
										title={rowLists.length > 0 ? `In: ${rowLists.join(', ')}` : 'Add to list'}
										onclick={() => { v6RowListOpen = v6RowListOpen === i ? null : i; }}
									>
										<span class="material-icons-round text-base">{rowLists.length > 0 ? 'playlist_add_check' : 'playlist_add'}</span>
									</button>
									{#if v6RowListOpen === i}
										<button class="fixed inset-0 z-30" onclick={() => { v6RowListOpen = null; }} aria-label="Close"></button>
										<div class="absolute right-0 top-full z-40 mt-1 w-52 rounded-xl border border-grey-200 bg-white p-1.5 shadow-lg">
											{#each v6Store.lists.filter(l => l.type === 'people') as list}
												{@const isIn = rowLists.includes(list.name)}
												<button
													class="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm {isIn ? 'text-violet-700 bg-violet-50' : 'text-grey-800 hover:bg-grey-50'}"
													onclick={() => { if (!isIn) v6AddRowToList(i, list.name, person.name); else { v6RowListOpen = null; } }}
												>
													<span class="material-icons-round text-sm {isIn ? 'text-violet-500' : 'text-grey-400'}">{isIn ? 'check_circle' : 'radio_button_unchecked'}</span>
													{list.name}
												</button>
											{/each}
											<div class="my-1 border-t border-grey-100"></div>
											<button
												class="hover:bg-grey-50 flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-violet-700"
												onclick={() => { v6RowListOpen = null; toast.show('New list created'); }}
											>
												<span class="material-icons-round text-sm">add</span>
												Create new list
											</button>
										</div>
									{/if}
								</div>
							</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{person.industry}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- V6 Batch Enrich Modal -->
		{#if v6EnrichModalOpen}
			<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
				<div class="w-[440px] rounded-2xl border border-grey-200 bg-white p-6 shadow-xl">
					<div class="mb-5 flex items-center justify-between">
						<h3 class="text-grey-900 text-base font-semibold">Enrich {v6Selected.size} contacts</h3>
						<button class="text-grey-400 hover:text-grey-700" onclick={() => { v6EnrichModalOpen = false; }} aria-label="Close">
							<span class="material-icons-round">close</span>
						</button>
					</div>

					<!-- Enrichment types -->
					<p class="text-grey-500 mb-2 text-xs font-semibold uppercase tracking-wider">Enrichment type</p>
					<div class="mb-4 flex flex-col gap-1">
						<label class="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm text-grey-800 hover:bg-grey-50">
							<input type="checkbox" bind:checked={v6ModalEmailPro} class="accent-violet-700" />
							Professional email
						</label>
						<label class="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm text-grey-800 hover:bg-grey-50">
							<input type="checkbox" bind:checked={v6ModalPhone} class="accent-violet-700" />
							Phone
						</label>
						<label class="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1.5 text-sm text-grey-800 hover:bg-grey-50">
							<input type="checkbox" bind:checked={v6ModalPersonalEmail} class="accent-violet-700" />
							Personal email
						</label>
					</div>

					<!-- Add to list (optional) -->
					<p class="text-grey-500 mb-2 text-xs font-semibold uppercase tracking-wider">Add to a list <span class="font-normal normal-case text-grey-400">(optional)</span></p>
					<select
						bind:value={v6ModalList}
						class="border-grey-200 text-grey-800 mb-6 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
					>
						<option value="none">No list</option>
						<option value="Q3 Targets">Q3 Targets</option>
						<option value="Sales Leaders DACH">Sales Leaders DACH</option>
						<option value="new">Create new list…</option>
					</select>

					<div class="flex items-center justify-end gap-2">
						<button class="btn-ghost h-9 px-4 text-sm" onclick={() => { v6EnrichModalOpen = false; }}>Cancel</button>
						<button class="btn-primary h-9 gap-1.5 px-4 text-sm" onclick={v6LaunchBatchEnrich}>
							<span class="material-icons-round text-sm text-white">auto_awesome</span>
							Launch enrichment
						</button>
					</div>
				</div>
			</div>
		{/if}

	{:else}
		<!-- Table (non-V6 versions) -->
		<div class="bg-grey-50 flex-1 overflow-auto">
			<table class="w-full min-w-[900px]">
				<thead class="sticky top-0 z-10">
					<tr class="table-header">
						<th class="w-12 px-4 py-3"><input type="checkbox" /></th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Job title</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Headcount</th>
						<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Industry</th>
					</tr>
				</thead>
				<tbody class="bg-white">
					{#each people as person}
						<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
							<td class="px-4 py-3"><input type="checkbox" /></td>
							<td class="text-grey-900 px-4 py-3 text-sm font-medium">{person.name}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{person.title}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{person.company}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{person.location}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{person.headcount.toLocaleString()}</td>
							<td class="text-grey-700 px-4 py-3 text-sm">{person.industry}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>
