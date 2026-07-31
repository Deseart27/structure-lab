<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { v6Store } from '$lib/mock/v6.svelte';
	import Logo from './Logo.svelte';
	import Navigation from './Navigation.svelte';

	let version = $derived($page.params.version);
	let base = $derived(`${svelteBase}/${version}`);
	import { getSourceLabel, getSourceIcon } from '$lib/mock/v6.svelte';

	let runningJobs = $derived(v6Store.runs.filter(r => r.status === 'running'));
	let v11RunningOpen = $state(false);

	// V11: New Enrichment popover
	let v11NewOpen = $state(false);
	let v11ManualInput = $state('');
	let v11QuickEmail = $state(true);
	let v11QuickPhone = $state(true);
	let v11QuickList = $state('none');
</script>

<div class="border-grey-200 flex h-16 w-full min-w-0 items-center justify-between gap-4 border-b bg-white px-6" style="box-shadow: 0px 1px 2px 0px rgba(57, 47, 60, 0.04);">
	<div class="flex min-w-0 flex-1 items-center gap-4 lg:gap-8">
		<a href="{base}/app/search" class="shrink-0">
			<Logo height={32} width={32} />
		</a>
		<Navigation />

		{#if version === 'v11'}
			<div class="relative shrink-0">
				<button
					class="flex h-8 items-center gap-1.5 rounded-lg bg-violet-700 px-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-violet-800 hover:shadow-md"
					onclick={() => { v11NewOpen = !v11NewOpen; }}
				>
					<span class="material-icons-round text-base">add</span>
					New Enrichment
				</button>

				{#if v11NewOpen}
					<div class="fixed inset-0 z-30" onclick={() => { v11NewOpen = false; }}></div>
					<div class="absolute right-0 top-full z-40 mt-2 w-80 rounded-xl border border-grey-200 bg-white p-4 shadow-xl">
						<div class="mb-3">
							<label class="text-grey-500 text-[10px] font-semibold uppercase tracking-wider mb-1.5 block">Quick enrich</label>
							<div class="flex items-center gap-2 rounded-lg border border-grey-200 bg-grey-50 px-3 py-2">
								<span class="material-icons-round text-grey-400 text-base">person_search</span>
								<input
									type="text"
									placeholder="Paste email, LinkedIn URL, or name…"
									class="w-full bg-transparent text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none"
									bind:value={v11ManualInput}
								/>
							</div>
							<!-- Data type toggles + list -->
							<div class="flex items-center gap-3 mt-2">
								<label class="flex items-center gap-1.5 cursor-pointer">
									<input type="checkbox" bind:checked={v11QuickEmail} class="accent-violet-700 h-3 w-3" />
									<span class="material-icons-round text-xs text-pink-400">email</span>
									<span class="text-[11px] font-medium text-grey-700">Email</span>
								</label>
								<label class="flex items-center gap-1.5 cursor-pointer">
									<input type="checkbox" bind:checked={v11QuickPhone} class="accent-violet-700 h-3 w-3" />
									<span class="material-icons-round text-xs text-violet-400">phone</span>
									<span class="text-[11px] font-medium text-grey-700">Phone</span>
								</label>
								<select class="ml-auto rounded-lg border border-grey-200 bg-white px-2 py-1 text-[11px] text-grey-600 focus:outline-none focus:ring-1 focus:ring-violet-300 max-w-[110px]" bind:value={v11QuickList}>
									<option value="none">No list</option>
									{#each v6Store.lists.filter(l => l.type === 'people') as list}
										<option value={list.id}>{list.name}</option>
									{/each}
								</select>
							</div>
							<button
								class="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors {v11ManualInput.trim() && (v11QuickEmail || v11QuickPhone) ? 'bg-violet-600 text-white hover:bg-violet-700 shadow-sm' : 'bg-grey-100 text-grey-400 cursor-not-allowed'}"
								disabled={!v11ManualInput.trim() || (!v11QuickEmail && !v11QuickPhone)}
							>
								<span class="material-icons-round text-sm">bolt</span>
								Enrich{v11QuickEmail && v11QuickPhone ? '' : v11QuickEmail ? ' email' : ' phone'}
							</button>
						</div>
						<div class="border-t border-grey-100 pt-3">
							<label class="text-grey-500 text-[10px] font-semibold uppercase tracking-wider mb-2 block">Or start from</label>
							<div class="grid grid-cols-2 gap-2">
								<button class="flex items-center gap-2.5 rounded-lg border border-grey-200 px-3 py-2.5 text-left transition-colors hover:bg-grey-50 hover:border-violet-200">
									<span class="material-icons-round text-grey-500 text-base">upload_file</span>
									<div><p class="text-sm font-medium text-grey-800">CSV Upload</p><p class="text-[10px] text-grey-400">Import a file</p></div>
								</button>
								<button class="flex items-center gap-2.5 rounded-lg border border-grey-200 px-3 py-2.5 text-left transition-colors hover:bg-grey-50 hover:border-violet-200">
									<span class="material-icons-round text-grey-500 text-base">search</span>
									<div><p class="text-sm font-medium text-grey-800">Search</p><p class="text-[10px] text-grey-400">Find & enrich</p></div>
								</button>
								<button class="flex items-center gap-2.5 rounded-lg border border-grey-200 px-3 py-2.5 text-left transition-colors hover:bg-grey-50 hover:border-violet-200">
									<span class="material-icons-round text-grey-500 text-base">hub</span>
									<div><p class="text-sm font-medium text-grey-800">CRM Import</p><p class="text-[10px] text-grey-400">From HubSpot</p></div>
								</button>
								<button class="flex items-center gap-2.5 rounded-lg border border-grey-200 px-3 py-2.5 text-left transition-colors hover:bg-grey-50 hover:border-violet-200">
									<span class="material-icons-round text-grey-500 text-base">code</span>
									<div><p class="text-sm font-medium text-grey-800">API</p><p class="text-[10px] text-grey-400">Programmatic</p></div>
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<div class="flex shrink-0 items-center gap-3 lg:gap-5">
		{#if version === 'v6' || version === 'v7' || version === 'v8' || version === 'v9'}
			<!-- New enrichment shortcut -->
			<a
				href="{base}/app/enrich"
				class="flex h-8 items-center gap-1.5 rounded-lg border border-grey-200 bg-white px-2.5 text-sm font-medium text-grey-600 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
				title="New enrichment"
			>
				<span class="material-icons-round text-base">add</span>
				<span class="hidden lg:inline">New enrichment</span>
			</a>
		{/if}

		{#if version === 'v11' && runningJobs.length > 0}
			<!-- Running jobs indicator + dropdown on hover -->
			<div
				class="relative"
				onmouseenter={() => { v11RunningOpen = true; }}
				onmouseleave={() => { v11RunningOpen = false; }}
			>
				<div
					class="flex h-8 items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 text-xs font-medium text-violet-700 cursor-default"
				>
					<span class="material-icons-round text-sm animate-spin text-violet-500" style="animation-duration: 1.5s;">sync</span>
					{runningJobs.length} running
				</div>

				{#if v11RunningOpen}
					<div class="absolute right-0 top-full z-50 pt-1">
					<div class="w-80 rounded-xl border border-grey-200 bg-white shadow-xl">
						<div class="flex items-center justify-between px-4 pt-3 pb-2">
							<p class="text-grey-700 text-xs font-semibold uppercase tracking-wider">Running enrichments</p>
							<span class="text-grey-400 text-[10px]">{runningJobs.length} job{runningJobs.length > 1 ? 's' : ''}</span>
						</div>
						<div class="flex flex-col pb-2">
							{#each runningJobs as run}
								<a
									href="{base}/app/prospects?view=contacts&enrichment={run.id}"
									class="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-grey-50"
									onclick={() => { v11RunningOpen = false; }}
								>
									<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100">
										<span class="material-icons-round text-sm text-violet-600">{getSourceIcon(run.source, run.inputMethod)}</span>
									</div>
									<div class="min-w-0 flex-1">
										<p class="text-grey-900 text-sm font-medium truncate">{run.name}</p>
										<p class="text-grey-400 text-[10px]">{getSourceLabel(run.source, run.inputMethod)} · {run.contactsCount} contacts</p>
									</div>
									<div class="flex items-center gap-1.5 shrink-0">
										<div class="bg-grey-200 h-1.5 w-14 overflow-hidden rounded-full">
											<div class="h-full rounded-full bg-gradient-to-r from-violet-400 to-violet-600" style:width="{run.progress}%"></div>
										</div>
										<span class="text-violet-600 text-[10px] font-bold">{run.progress}%</span>
									</div>
								</a>
							{/each}
						</div>
					</div>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Credit chip -->
		<button class="text-grey-900 flex h-8 items-center rounded-3xl border border-amber-200 bg-amber-50 py-1 pr-3 pl-2 text-sm font-medium">
			<span class="material-icons-round mr-1.5 text-base text-amber-500">stars</span>
			<span class="whitespace-nowrap">1,250 Credits</span>
		</button>

		<!-- Settings dropdown -->
		<button class="btn-tertiary text-grey-900 h-10 pr-1 pl-2 text-base">
			<div class="min-w-0">
				<div class="text-grey-900 flex items-center gap-1 text-base whitespace-nowrap">
					Settings
				</div>
				<div class="text-grey-700 max-w-[160px] truncate text-xs font-normal">
					My Workspace
				</div>
			</div>
			<span class="material-icons-round text-grey-700 ml-2">keyboard_arrow_down</span>
		</button>
	</div>
</div>
