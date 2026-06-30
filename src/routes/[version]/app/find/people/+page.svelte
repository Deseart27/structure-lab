<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	let base = $derived(`${svelteBase}/${$page.params.version}`);

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

	let selected: Set<number> = $state(new Set());

	function toggleAll() {
		if (selected.size === people.length) selected = new Set();
		else selected = new Set(people.map((_, i) => i));
	}
</script>

<div class="flex h-full flex-col">
	<!-- Header -->
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h2 class="text-grey-900 text-base font-semibold">{people.length} people</h2>
		</div>
		<div class="flex items-center gap-2">
			{#if selected.size > 0}
				<span class="text-grey-600 mr-1 text-sm">{selected.size} selected</span>
			{/if}
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm">
				<span class="material-icons-round text-grey-600 text-base">playlist_add</span>
				Save to list
			</button>
			<button class="btn-ghost h-8 gap-1.5 px-3 text-sm">
				<span class="material-icons-round text-grey-600 text-base">download</span>
				Export
			</button>
			<button class="btn-primary h-8 gap-1 px-3 text-sm">
				<span class="material-icons-round text-sm text-white">auto_awesome</span>
				Enrich & Save
			</button>
		</div>
	</div>

	<!-- Table -->
	<div class="bg-grey-50 flex-1 overflow-auto">
		<table class="w-full min-w-[900px]">
			<thead class="bg-grey-50 sticky top-0 z-10">
				<tr class="border-grey-200 border-b">
					<th class="w-12 px-4 py-3"><input type="checkbox" checked={selected.size === people.length} onchange={toggleAll} /></th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Job title</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Headcount</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Industry</th>
				</tr>
			</thead>
			<tbody class="bg-white">
				{#each people as person, i}
					<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
						<td class="px-4 py-3"><input type="checkbox" checked={selected.has(i)} onchange={() => {
							const next = new Set(selected);
							if (next.has(i)) next.delete(i); else next.add(i);
							selected = next;
						}} /></td>
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
</div>
