<script lang="ts">
	import { toast } from '$lib/toast.svelte';

	const tools = [
		{ name: 'Lemlist' },
		{ name: 'Smartlead' },
		{ name: 'Instantly' },
		{ name: 'Outreach' },
		{ name: 'Salesloft' },
		{ name: 'HeyReach' },
		{ name: 'LaGrowthMachine' },
		{ name: 'Reply.io' },
		{ name: 'GoHighLevel' },
		{ name: 'Saleshandy' },
		{ name: 'Snov.io' },
	];
</script>

<div class="flex h-full flex-col overflow-auto p-8">
	<h1 class="text-grey-900 mb-1 text-xl font-semibold">Engagement</h1>
	<p class="text-grey-500 mb-8 text-sm">Connect your sequencing and outreach tools to push enriched contacts directly.</p>

	<div class="grid grid-cols-3 gap-4">
		{#each tools as tool}
			<div class="border-grey-200 hover:border-grey-300 flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors">
				<div class="bg-grey-100 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
					<span class="material-icons-round text-grey-600 text-lg">campaign</span>
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-grey-900 text-sm font-medium">{tool.name}</p>
					<button
						class="text-violet-700 hover:text-violet-800 mt-0.5 text-xs font-medium"
						onclick={() => toast.show(`Connected to ${tool.name}`)}
					>
						Connect
					</button>
				</div>
			</div>
		{/each}
	</div>

	<div class="border-grey-200 mt-8 rounded-xl border p-6 text-center">
		<p class="text-grey-600 text-sm">Can't find what you're looking for?</p>
		<button class="btn-ghost mt-2 h-8 text-sm text-violet-700">Request an integration</button>
	</div>
</div>
