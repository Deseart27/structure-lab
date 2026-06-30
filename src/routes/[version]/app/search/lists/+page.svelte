<script lang="ts">
	const lists = [
		{ name: 'SaaS Founders Q1', contacts: 234, enriched: 198, exported: 156, created: 'Dec 15, 2024' },
		{ name: 'VP Sales Software', contacts: 187, enriched: 162, exported: 134, created: 'Jan 3, 2025' },
		{ name: 'Series B Startups', contacts: 412, enriched: 387, exported: 298, created: 'Jan 20, 2025' },
		{ name: 'European Marketing Leads', contacts: 156, enriched: 89, exported: 67, created: 'Feb 1, 2025' },
		{ name: 'Agency Owners USA', contacts: 89, enriched: 45, exported: 38, created: 'Feb 14, 2025' },
	];
</script>

<div class="flex h-full flex-col bg-white">
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<h2 class="text-grey-900 text-base font-semibold">Lists</h2>
	</div>

	<div class="flex-1 overflow-auto px-6 py-4">
		<table class="w-full">
			<thead>
				<tr class="border-grey-200 border-b">
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Contacts</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Enriched</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Exported</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Created</th>
					<th class="text-grey-600 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each lists as list}
					<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
						<td class="text-grey-900 px-4 py-3 text-sm font-medium">{list.name}</td>
						<td class="text-grey-700 px-4 py-3 text-sm">{list.contacts}</td>
						<td class="text-grey-700 px-4 py-3 text-sm">{list.enriched}</td>
						<td class="text-grey-700 px-4 py-3 text-sm">{list.exported}</td>
						<td class="text-grey-500 px-4 py-3 text-sm">{list.created}</td>
						<td class="px-4 py-3 text-right">
							<div class="flex items-center justify-end gap-2">
								<button class="btn-ghost h-7 px-2 text-xs">Enrich</button>
								<button class="btn-ghost h-7 px-2 text-xs">Export</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
