<script lang="ts">
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';
	let version = $derived($page.params.version);

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
</script>

<div class="flex h-full flex-col">
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h2 class="text-grey-900 text-base font-semibold">{companies.length} companies</h2>
		</div>
		<div class="flex items-center gap-2">
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Export started — CSV will download shortly')}>
				<span class="material-icons-round text-grey-600 text-base">download</span>
				Export
			</button>
			{#if version === 'v2'}
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Companies saved to list')}>
					<span class="material-icons-round text-grey-600 text-base">playlist_add</span>
					Save to list
				</button>
				<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" style="color: #ff7a59;" onclick={() => toast.show('Companies pushed to HubSpot')}>
					<span class="material-icons-round text-base">hub</span>
					Push to HubSpot
				</button>
			{/if}
			<button class="btn-primary h-8 gap-1.5 px-3 text-sm" onclick={() => toast.show('Finding employees...')}>
				<span class="material-icons-round text-sm text-white">group</span>
				Find employees
			</button>
		</div>
	</div>

	<div class="bg-grey-50 flex-1 overflow-auto">
		<table class="w-full min-w-[800px]">
			<thead class="bg-grey-50 sticky top-0 z-10">
				<tr class="border-grey-200 border-b">
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
	</div>
</div>
