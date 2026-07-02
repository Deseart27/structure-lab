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
			<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800" onclick={pushCRM}>
				<span class="material-icons-round text-base" style="color: #ff7a59;">hub</span>
				Push to HubSpot
			</button>
			<button class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800" onclick={exportCSV}>
				<span class="material-icons-round text-grey-500 text-base">description</span>
				Export CSV
			</button>
			<div class="relative">
				<button class="hover:bg-grey-50 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-grey-800" onclick={() => { engagementOpen = !engagementOpen; }}>
					<span class="flex items-center gap-2.5">
						<span class="material-icons-round text-grey-500 text-base">campaign</span>
						Push to engagement tool
					</span>
					<span class="material-icons-round text-grey-400 text-xs">chevron_right</span>
				</button>
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
