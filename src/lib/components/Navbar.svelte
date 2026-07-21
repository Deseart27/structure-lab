<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import Logo from './Logo.svelte';
	import Navigation from './Navigation.svelte';

	let version = $derived($page.params.version);
	let base = $derived(`${svelteBase}/${version}`);
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
