<script lang="ts" module>
	// Shared pinned export method across all ExportPopover instances
	export type ExportMethod = 'hubspot' | 'csv' | 'engagement';
	let _pinned = $state<ExportMethod>('hubspot');
	export const pinnedExport = {
		get method() { return _pinned; },
		set method(v: ExportMethod) { _pinned = v; },
	};
</script>

<script lang="ts">
	import { toast } from '$lib/toast.svelte';
	import { v6Store } from '$lib/mock/v6.svelte';

	let {
		open = $bindable(false),
		context = 'people',
		count = 0,
		sourceName = '',
	}: {
		open: boolean;
		context?: 'people' | 'companies';
		count?: number;
		sourceName?: string;
	} = $props();

	let contactsMode: 'all' | 'enriched' = $state('all');
	let includeEmails = $state(true);
	let includeFunding = $state(false);
	let includeFinancials = $state(false);

	function pushCRM() {
		open = false;
		const label = count > 0 ? `${count} contacts` : 'contacts';
		toast.show(`Pushing ${label} to HubSpot — contacts will be created or updated (3-way dedup). Trace available in Integrations > CRM.`);
		v6Store.addPush({
			id: `p${Date.now()}`,
			date: 'Just now',
			source: sourceName ? 'Job' : 'Search',
			sourceName: sourceName || 'Search selection',
			contactsCount: count || 1,
			status: 'completed',
		});
	}

	export function runPinned() {
		if (pinnedExport.method === 'hubspot') pushCRM();
		else if (pinnedExport.method === 'csv') exportCSV();
		else pushEngagement('Lemlist');
	}

	function exportCSV() {
		open = false;
		toast.show('CSV export started — download will begin shortly.');
	}

	let engagementOpen = $state(false);

	function pushEngagement(tool: string) {
		open = false;
		engagementOpen = false;
		toast.show(`Pushed to ${tool}`);
	}

	function pin(method: ExportMethod) {
		pinnedExport.method = method;
		toast.show(`${method === 'hubspot' ? 'Push to HubSpot' : method === 'csv' ? 'Export CSV' : 'Push to engagement tool'} set as quick export`);
	}
</script>

{#if open}
	<!-- Backdrop -->
	<button class="fixed inset-0 z-30" onclick={() => { open = false; }} aria-label="Close"></button>

	<div class="absolute right-0 top-full z-40 mt-1 w-72 rounded-xl border border-grey-200 bg-white p-3 shadow-lg animate-fade-in">
		<!-- Contacts mode (hide for companies) -->
		{#if context === 'people'}
			<div class="mb-3">
				<p class="text-grey-500 mb-1.5 text-xs font-semibold uppercase tracking-wider">Contacts</p>
				<label class="flex items-center gap-2 px-1 py-1 text-sm text-grey-800 cursor-pointer">
					<input type="radio" name="contacts-mode" value="all" bind:group={contactsMode} class="accent-violet-700" />
					All contacts
				</label>
				<label class="flex items-center gap-2 px-1 py-1 text-sm text-grey-800 cursor-pointer">
					<input type="radio" name="contacts-mode" value="enriched" bind:group={contactsMode} class="accent-violet-700" />
					Enriched only
				</label>
			</div>
		{/if}

		<!-- Data to include -->
		<div class="mb-3 border-t border-grey-100 pt-3">
			<p class="text-grey-500 mb-1.5 text-xs font-semibold uppercase tracking-wider">Data to include</p>
			<label class="flex items-center gap-2 px-1 py-1 text-sm text-grey-400 cursor-not-allowed">
				<input type="checkbox" checked disabled class="opacity-50" />
				Contact info
			</label>
			<label class="flex items-center gap-2 px-1 py-1 text-sm text-grey-800 cursor-pointer">
				<input type="checkbox" bind:checked={includeEmails} />
				Emails & Phones
			</label>
			<label class="flex items-center justify-between px-1 py-1 text-sm text-grey-800 cursor-pointer">
				<span class="flex items-center gap-2">
					<input type="checkbox" bind:checked={includeFunding} />
					Funding data
				</span>
				<span class="flex items-center gap-1 text-xs text-grey-400">
					<span class="material-icons-round text-xs">lock</span>
					+2 cr/co
				</span>
			</label>
			<label class="flex items-center justify-between px-1 py-1 text-sm text-grey-800 cursor-pointer">
				<span class="flex items-center gap-2">
					<input type="checkbox" bind:checked={includeFinancials} />
					Financials
				</span>
				<span class="flex items-center gap-1 text-xs text-grey-400">
					<span class="material-icons-round text-xs">lock</span>
					+3 cr/co
				</span>
			</label>
		</div>

		<!-- Destination buttons -->
		<div class="border-t border-grey-100 pt-2 flex flex-col gap-0.5">
			<!-- Push to HubSpot -->
			<div class="group flex items-center rounded-lg hover:bg-grey-50">
				<button class="flex flex-1 items-center gap-2.5 px-3 py-2 text-sm text-grey-800" onclick={pushCRM}>
					<svg class="h-4 w-4 shrink-0" viewBox="0 0 1024 1024">
						<circle cx="512" cy="512" r="512" fill="#FF7A59"/>
						<path d="M623.8 624.94c-38.23 0-69.24-30.67-69.24-68.51s31-68.52 69.24-68.52 69.26 30.67 69.26 68.52-31 68.51-69.26 68.51m20.74-200.42v-61a46.83 46.83 0 0 0 27.33-42.29v-1.41c0-25.78-21.32-46.86-47.35-46.86h-1.43c-26 0-47.35 21.09-47.35 46.86v1.41a46.85 46.85 0 0 0 27.33 42.29v61a135.08 135.08 0 0 0-63.86 27.79l-169.1-130.17A52.49 52.49 0 0 0 372 309c0-29.21-23.89-52.92-53.4-53s-53.45 23.59-53.48 52.81 23.85 52.88 53.36 52.93a53.29 53.29 0 0 0 26.33-7.09l166.38 128.1a132.14 132.14 0 0 0 2.07 150.3l-50.62 50.1A43.42 43.42 0 1 0 450.1 768c24.24 0 43.9-19.46 43.9-43.45a42.24 42.24 0 0 0-2-12.42l50-49.52a135.28 135.28 0 0 0 81.8 27.47c74.61 0 135.06-59.83 135.06-133.65 0-66.82-49.62-122-114.33-131.91" fill="#fff" fill-rule="evenodd"/>
					</svg>
					Push to HubSpot
				</button>
				<button
					class="mr-1 flex h-6 w-6 items-center justify-center rounded transition-colors {pinnedExport.method === 'hubspot' ? 'text-violet-500' : 'text-grey-300 opacity-0 group-hover:opacity-100 hover:text-grey-500'}"
					title={pinnedExport.method === 'hubspot' ? 'Pinned as quick export' : 'Pin as quick export'}
					onclick={() => pin('hubspot')}
				>
					<span class="material-icons-round text-sm">{pinnedExport.method === 'hubspot' ? 'push_pin' : 'push_pin'}</span>
				</button>
			</div>
			<!-- Export CSV -->
			<div class="group flex items-center rounded-lg hover:bg-grey-50">
				<button class="flex flex-1 items-center gap-2.5 px-3 py-2 text-sm text-grey-800" onclick={exportCSV}>
					<span class="material-icons-round text-grey-500 text-base">description</span>
					Export CSV
				</button>
				<button
					class="mr-1 flex h-6 w-6 items-center justify-center rounded transition-colors {pinnedExport.method === 'csv' ? 'text-violet-500' : 'text-grey-300 opacity-0 group-hover:opacity-100 hover:text-grey-500'}"
					title={pinnedExport.method === 'csv' ? 'Pinned as quick export' : 'Pin as quick export'}
					onclick={() => pin('csv')}
				>
					<span class="material-icons-round text-sm">push_pin</span>
				</button>
			</div>
			<!-- Push to engagement tool -->
			<div class="relative">
				<div class="group flex items-center rounded-lg hover:bg-grey-50">
					<button class="flex flex-1 items-center justify-between px-3 py-2 text-sm text-grey-800" onclick={() => { engagementOpen = !engagementOpen; }}>
						<span class="flex items-center gap-2.5">
							<span class="material-icons-round text-grey-500 text-base">campaign</span>
							Push to engagement tool
						</span>
						<span class="material-icons-round text-grey-400 text-xs">chevron_right</span>
					</button>
					<button
						class="mr-1 flex h-6 w-6 items-center justify-center rounded transition-colors {pinnedExport.method === 'engagement' ? 'text-violet-500' : 'text-grey-300 opacity-0 group-hover:opacity-100 hover:text-grey-500'}"
						title={pinnedExport.method === 'engagement' ? 'Pinned as quick export' : 'Pin as quick export'}
						onclick={() => pin('engagement')}
					>
						<span class="material-icons-round text-sm">push_pin</span>
					</button>
				</div>
				{#if engagementOpen}
					<div class="absolute left-full top-0 ml-1 w-44 rounded-xl border border-grey-200 bg-white p-1.5 shadow-lg">
						{#each ['Lemlist', 'Smartlead', 'Instantly', 'Outreach', 'Salesloft', 'HeyReach'] as tool}
							<button class="hover:bg-grey-50 flex w-full items-center rounded-lg px-3 py-1.5 text-sm text-grey-800" onclick={() => pushEngagement(tool)}>
								{tool}
							</button>
						{/each}
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
