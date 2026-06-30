<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	let base = $derived(`${svelteBase}/${$page.params.version}`);

	let rows = $state([
		{ firstName: '', lastName: '', company: '', linkedin: '' },
		{ firstName: '', lastName: '', company: '', linkedin: '' },
		{ firstName: '', lastName: '', company: '', linkedin: '' },
	]);

	function addRow() {
		rows = [...rows, { firstName: '', lastName: '', company: '', linkedin: '' }];
	}
</script>

<div class="flex h-full flex-col">
	<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
		<h2 class="text-grey-900 text-base font-semibold">Manual Entry</h2>
		<div class="flex items-center gap-2">
			<button class="btn-ghost h-8 px-3 text-sm" onclick={() => { rows = [{ firstName: '', lastName: '', company: '', linkedin: '' }, { firstName: '', lastName: '', company: '', linkedin: '' }, { firstName: '', lastName: '', company: '', linkedin: '' }]; }}>
				Clear all
			</button>
			<button class="btn-primary h-8 gap-1 px-3 text-sm">
				<span class="material-icons-round text-sm text-white">auto_awesome</span>
				Enrich & Save
			</button>
		</div>
	</div>

	<div class="flex-1 overflow-auto p-6">
		<p class="text-grey-600 mb-4 text-sm">Add contacts one by one. Provide either a LinkedIn URL or name + company for best results. Results go to your selected Prospects list.</p>

		<div class="flex flex-col gap-3">
			<!-- Header -->
			<div class="flex gap-3 px-3">
				<span class="text-grey-500 flex-1 text-xs font-semibold uppercase tracking-wider">First name</span>
				<span class="text-grey-500 flex-1 text-xs font-semibold uppercase tracking-wider">Last name</span>
				<span class="text-grey-500 flex-1 text-xs font-semibold uppercase tracking-wider">Company</span>
				<span class="text-grey-500 flex-1 text-xs font-semibold uppercase tracking-wider">LinkedIn URL</span>
				<span class="w-8"></span>
			</div>

			{#each rows as row, i}
				<div class="border-grey-200 flex items-center gap-3 rounded-lg border p-3">
					<input class="input h-9 flex-1 text-sm" placeholder="Sarah" bind:value={row.firstName} />
					<input class="input h-9 flex-1 text-sm" placeholder="Chen" bind:value={row.lastName} />
					<input class="input h-9 flex-1 text-sm" placeholder="Stripe" bind:value={row.company} />
					<input class="input h-9 flex-1 text-sm" placeholder="linkedin.com/in/..." bind:value={row.linkedin} />
					<button
						class="btn-ghost flex h-8 w-8 shrink-0 items-center justify-center p-0"
						onclick={() => { rows = rows.filter((_, j) => j !== i); }}
					>
						<span class="material-icons-round text-grey-400 text-base">close</span>
					</button>
				</div>
			{/each}

			<button class="btn-ghost flex h-8 items-center gap-1.5 self-start text-sm" onclick={addRow}>
				<span class="material-icons-round text-base">add</span>
				Add Contact
			</button>
		</div>
	</div>
</div>
