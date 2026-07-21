<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';
	import { v6Store } from '$lib/mock/v6.svelte';
	import ExportPopover from '$lib/components/ExportPopover.svelte';

	let base = $derived(`${svelteBase}/${$page.params.version}`);
	let version = $derived($page.params.version);
	let companyId = $derived($page.params.companyId);

	let company = $derived(v6Store.getCompany(companyId));

	let exportOpen = $state(false);
	let fundingUnlocking = $state(false);
	let financialsUnlocking = $state(false);

	function unlockFunding() {
		if (!company || fundingUnlocking) return;
		fundingUnlocking = true;
		setTimeout(() => {
			v6Store.unlockFunding(companyId);
			fundingUnlocking = false;
			toast.show('Funding unlocked — cached for your workspace');
		}, 1000);
	}

	function unlockFinancials() {
		if (!company || financialsUnlocking) return;
		financialsUnlocking = true;
		setTimeout(() => {
			v6Store.unlockFinancials(companyId);
			financialsUnlocking = false;
			toast.show('Financials unlocked — cached for your workspace');
		}, 1000);
	}
</script>

{#if version === 'v6' || version === 'v7' || version === 'v8' || version === 'v9'}
	{#if company}
		<div class="flex h-full flex-col">
			<!-- Header -->
			<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
				<div class="flex items-center gap-3">
					<a href="{base}/app/search/companies" class="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg p-0">
						<span class="material-icons-round text-grey-600 text-lg">arrow_back</span>
					</a>
					<div>
						<h1 class="text-grey-900 text-base font-semibold leading-tight">{company.name}</h1>
						<p class="text-grey-500 text-xs">{company.domain}</p>
					</div>
					<span class="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">{company.industry}</span>
					<span class="text-grey-500 text-sm">{company.headcount.toLocaleString()} employees</span>
					<span class="text-grey-400 text-sm">·</span>
					<span class="text-grey-500 text-sm">{company.location}</span>
				</div>
				<div class="flex items-center gap-2">
					<button
						class="btn-ghost h-8 gap-1.5 px-3 text-sm"
						onclick={() => toast.show(`${company?.name} added to list`)}
					>
						<span class="material-icons-round text-grey-600 text-base">playlist_add</span>
						Add to list
					</button>
					<div class="relative">
						<button class="btn-ghost h-8 gap-1.5 px-3 text-sm" onclick={() => { exportOpen = !exportOpen; }}>
							<span class="material-icons-round text-grey-600 text-base">download</span>
							Export
							<span class="material-icons-round text-grey-400 text-sm">expand_more</span>
						</button>
						<ExportPopover
							bind:open={exportOpen}
							context="companies"
							count={1}
							sourceName={company.name}
						/>
					</div>
				</div>
			</div>

			<!-- Bundle cards grid -->
			<div class="flex-1 overflow-auto p-6">
				<div class="grid grid-cols-2 gap-4 max-w-4xl">

					<!-- Last Funding card -->
					<div class="rounded-2xl border border-grey-200 bg-white p-5">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-grey-900 text-sm font-semibold">Last Funding</h2>
							{#if company.fundingUnlocked}
								<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
									<span class="material-icons-round text-xs">check_circle</span>
									Unlocked
								</span>
							{/if}
						</div>

						{#if company.fundingUnlocked && company.funding}
							<!-- Unlocked state -->
							<dl class="space-y-2">
								<div class="flex items-center justify-between">
									<dt class="text-grey-500 text-xs">Round</dt>
									<dd class="text-grey-900 text-sm font-medium">{company.funding.round}</dd>
								</div>
								<div class="flex items-center justify-between">
									<dt class="text-grey-500 text-xs">Amount</dt>
									<dd class="text-grey-900 text-sm font-medium">${company.funding.amount}</dd>
								</div>
								<div class="flex items-center justify-between">
									<dt class="text-grey-500 text-xs">Date</dt>
									<dd class="text-grey-900 text-sm font-medium">{company.funding.date}</dd>
								</div>
								<div class="flex items-center justify-between">
									<dt class="text-grey-500 text-xs">Total raised</dt>
									<dd class="text-grey-900 text-sm font-medium">${company.funding.totalRaised}</dd>
								</div>
								<div class="border-grey-100 border-t pt-2">
									<dt class="text-grey-500 mb-1.5 text-xs">Investors</dt>
									<dd class="flex flex-wrap gap-1">
										{#each company.funding.investors as investor}
											<span class="inline-flex items-center rounded-full bg-grey-100 px-2 py-0.5 text-xs font-medium text-grey-700">{investor}</span>
										{/each}
									</dd>
								</div>
							</dl>
						{:else}
							<!-- Locked state -->
							<div class="relative overflow-hidden rounded-xl">
								<!-- Blurred placeholder content -->
								<div class="space-y-2 opacity-30 blur-sm select-none">
									<div class="flex items-center justify-between">
										<span class="text-grey-500 text-xs">Round</span>
										<span class="text-grey-900 text-sm font-medium">Series X</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-grey-500 text-xs">Amount</span>
										<span class="text-grey-900 text-sm font-medium">$000M</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-grey-500 text-xs">Date</span>
										<span class="text-grey-900 text-sm font-medium">Jan 2025</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-grey-500 text-xs">Total raised</span>
										<span class="text-grey-900 text-sm font-medium">$000M</span>
									</div>
								</div>
								<!-- Unlock overlay -->
								<div class="absolute inset-0 flex items-center justify-center">
									<button
										class="btn-primary flex h-8 items-center gap-1.5 px-4 text-sm shadow-sm"
										onclick={unlockFunding}
										disabled={fundingUnlocking}
									>
										{#if fundingUnlocking}
											<span class="material-icons-round animate-spin text-base text-white">sync</span>
											Unlocking…
										{:else}
											<span class="material-icons-round text-base text-white">lock_open</span>
											Unlock — 2 credits
										{/if}
									</button>
								</div>
							</div>
						{/if}
					</div>

					<!-- Financials card -->
					<div class="rounded-2xl border border-grey-200 bg-white p-5">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-grey-900 text-sm font-semibold">Financials</h2>
							{#if company.financialsUnlocked}
								<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
									<span class="material-icons-round text-xs">check_circle</span>
									Unlocked
								</span>
							{/if}
						</div>

						{#if company.financialsUnlocked && company.financials}
							<!-- Unlocked state -->
							<dl class="space-y-2">
								<div class="flex items-center justify-between">
									<dt class="text-grey-500 text-xs">Revenue range</dt>
									<dd class="text-grey-900 text-sm font-medium">{company.financials.revenue}</dd>
								</div>
								<div class="flex items-center justify-between">
									<dt class="text-grey-500 text-xs">Growth</dt>
									<dd class="text-emerald-700 text-sm font-medium">{company.financials.growth}</dd>
								</div>
								<div class="flex items-center justify-between">
									<dt class="text-grey-500 text-xs">Employees trend</dt>
									<dd class="text-grey-900 text-sm font-medium">{company.financials.employeesTrend}</dd>
								</div>
							</dl>
						{:else}
							<!-- Locked state -->
							<div class="relative overflow-hidden rounded-xl">
								<div class="space-y-2 opacity-30 blur-sm select-none">
									<div class="flex items-center justify-between">
										<span class="text-grey-500 text-xs">Revenue range</span>
										<span class="text-grey-900 text-sm font-medium">$00-00M</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-grey-500 text-xs">Growth</span>
										<span class="text-grey-900 text-sm font-medium">+000% YoY</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-grey-500 text-xs">Employees trend</span>
										<span class="text-grey-900 text-sm font-medium">+00% in 12 months</span>
									</div>
								</div>
								<div class="absolute inset-0 flex items-center justify-center">
									<button
										class="btn-primary flex h-8 items-center gap-1.5 px-4 text-sm shadow-sm"
										onclick={unlockFinancials}
										disabled={financialsUnlocking}
									>
										{#if financialsUnlocking}
											<span class="material-icons-round animate-spin text-base text-white">sync</span>
											Unlocking…
										{:else}
											<span class="material-icons-round text-base text-white">lock_open</span>
											Unlock — 3 credits
										{/if}
									</button>
								</div>
							</div>
						{/if}
					</div>

					<!-- Technographics card — Coming soon -->
					<div class="rounded-2xl border border-grey-200 bg-grey-50 p-5">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-grey-400 text-sm font-semibold">Technographics</h2>
							<span class="inline-flex items-center rounded-full bg-grey-100 px-2 py-0.5 text-xs font-medium text-grey-400">Coming soon</span>
						</div>
						<div class="space-y-2">
							{#each ['CRM', 'Analytics', 'Marketing automation', 'Data warehouse'] as _}
								<div class="bg-grey-200 h-3 w-full rounded-full opacity-40"></div>
							{/each}
						</div>
					</div>

					<!-- Intents card — Coming soon -->
					<div class="rounded-2xl border border-grey-200 bg-grey-50 p-5">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-grey-400 text-sm font-semibold">Intents</h2>
							<span class="inline-flex items-center rounded-full bg-grey-100 px-2 py-0.5 text-xs font-medium text-grey-400">Coming soon</span>
						</div>
						<div class="space-y-2">
							{#each [1, 2, 3] as _}
								<div class="bg-grey-200 h-3 w-full rounded-full opacity-40"></div>
							{/each}
						</div>
					</div>

					<!-- News card — Coming soon -->
					<div class="rounded-2xl border border-grey-200 bg-grey-50 p-5">
						<div class="mb-4 flex items-center justify-between">
							<h2 class="text-grey-400 text-sm font-semibold">News</h2>
							<span class="inline-flex items-center rounded-full bg-grey-100 px-2 py-0.5 text-xs font-medium text-grey-400">Coming soon</span>
						</div>
						<div class="space-y-2">
							{#each [1, 2, 3] as _}
								<div class="bg-grey-200 h-3 w-full rounded-full opacity-40"></div>
							{/each}
						</div>
					</div>

				</div>

				<!-- Note -->
				<p class="text-grey-400 mt-4 max-w-4xl text-xs">
					Unlocked bundles are cached workspace-wide and appear as extra columns in exports.
				</p>
			</div>
		</div>
	{:else}
		<div class="flex h-full items-center justify-center">
			<p class="text-grey-400 text-sm">Company not found.</p>
		</div>
	{/if}
{/if}
