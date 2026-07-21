<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { v6Store } from '$lib/mock/v6.svelte';

	let version = $derived($page.params.version);
	let base = $derived(`${svelteBase}/${version}`);

	let allCompanies = $derived(v6Store.companies);
</script>

{#if version === 'v9'}
<div class="flex h-full flex-col">
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<div class="flex items-center gap-3">
			<h1 class="text-grey-900 text-base font-semibold">All Companies</h1>
			<span class="text-grey-500 text-sm">{allCompanies.length} companies across all lists</span>
		</div>
	</div>

	<div class="flex-1 overflow-auto">
		<table class="w-full min-w-[1100px]">
			<thead class="sticky top-0 z-10">
				<tr class="table-header">
					<th class="text-grey-600 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Domain</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Industry</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Headcount</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Location</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Founded</th>
					<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">In lists</th>
				</tr>
			</thead>
			<tbody class="bg-white">
				{#each allCompanies as company}
					{@const companyLists = v6Store.getListsForCompany(company.id)}
					<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors">
						<td class="px-5 py-3">
							<div>
								<p class="text-grey-900 text-sm font-medium">{company.name}</p>
								<p class="text-grey-400 text-xs">{company.type}</p>
							</div>
						</td>
						<td class="px-4 py-3">
							<span class="text-grey-700 font-mono text-xs">{company.domain}</span>
						</td>
						<td class="text-grey-700 px-4 py-3 text-sm">{company.industry}</td>
						<td class="text-grey-700 px-4 py-3 text-sm">{company.headcount.toLocaleString()}</td>
						<td class="text-grey-600 px-4 py-3 text-sm">{company.location}</td>
						<td class="text-grey-600 px-4 py-3 text-sm">{company.yearFounded}</td>
						<td class="px-4 py-3">
							{#if companyLists.length > 0}
								<div class="flex flex-wrap gap-1">
									{#each companyLists.slice(0, 2) as clist}
										<a
											href="{base}/app/prospects/{clist.id}"
											class="inline-flex items-center gap-1 rounded-full border border-grey-200 bg-grey-50 px-2 py-0.5 text-xs font-medium text-grey-700 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 transition-colors"
										>
											<span class="material-icons-round text-[10px]">folder</span>
											<span class="max-w-[100px] truncate">{clist.name}</span>
										</a>
									{/each}
									{#if companyLists.length > 2}
										<span class="text-grey-400 text-xs">+{companyLists.length - 2}</span>
									{/if}
								</div>
							{:else}
								<span class="text-grey-300 text-xs">No list</span>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
{:else}
<div class="flex h-full items-center justify-center">
	<p class="text-grey-400 text-sm">This page is only available in V9.</p>
</div>
{/if}
