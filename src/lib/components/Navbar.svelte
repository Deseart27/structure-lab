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
</script>

<div class="border-grey-200 flex h-16 w-full min-w-0 items-center justify-between gap-4 border-b bg-white px-6" style="box-shadow: 0px 1px 2px 0px rgba(57, 47, 60, 0.04);">
	<div class="flex min-w-0 flex-1 items-center gap-4 lg:gap-8">
		<a href="{base}/app/search" class="shrink-0">
			<Logo height={32} width={32} />
		</a>
		<Navigation />
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
									href="{base}/app/prospects?job={run.id}"
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
