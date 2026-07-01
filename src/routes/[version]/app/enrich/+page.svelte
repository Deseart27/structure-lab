<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';

	let version = $derived($page.params.version);
	let base = $derived(`${svelteBase}/${version}`);

	let mode: '' | 'csv' | 'manual' = $state('');
	let enrichType: 'mix' | 'phone' | 'email' = $state('mix');
	let personalEmail = $state(false);

	// V1: enrichment history (old model — lists inside enrich section)
	const v1Enrichments = [
		{ name: 'Q1 Sales Leads', type: 'CSV', contacts: 234, found: 198, status: 'completed', date: 'Jan 15, 2025' },
		{ name: 'LinkedIn Import', type: 'LinkedIn', contacts: 89, found: 67, status: 'completed', date: 'Jan 20, 2025' },
		{ name: 'Manual Batch #3', type: 'Manual', contacts: 12, found: 10, status: 'completed', date: 'Feb 1, 2025' },
		{ name: 'Series B Founders', type: 'CSV', contacts: 156, found: 0, status: 'running', date: 'Feb 14, 2025' },
		{ name: 'VP Engineering EU', type: 'CSV', contacts: 412, found: 387, status: 'completed', date: 'Feb 20, 2025' },
	];

	// V2: jobs — tracks the process, not the result. Results live in Lists.
	type Job = { id: string; list: string; listId: string; input: string; enrichType: string; contacts: number; found: number; status: 'completed' | 'running' | 'queued'; progress: number; started: string };
	const jobs: Job[] = [
		{ id: 'j1', list: 'SaaS Founders Q1', listId: '1', input: 'CSV', enrichType: 'Mix', contacts: 234, found: 198, status: 'completed', progress: 100, started: '2 hours ago' },
		{ id: 'j2', list: 'Series B Startups', listId: '3', input: 'CSV', enrichType: 'Email', contacts: 156, found: 72, status: 'running', progress: 46, started: '12 min ago' },
		{ id: 'j3', list: 'VP Sales Software', listId: '2', input: 'Manual', enrichType: 'Phone', contacts: 12, found: 0, status: 'queued', progress: 0, started: '3 min ago' },
		{ id: 'j4', list: 'Agency Owners USA', listId: '5', input: 'CSV', enrichType: 'Mix', contacts: 89, found: 45, status: 'completed', progress: 100, started: '1 day ago' },
		{ id: 'j5', list: 'European Marketing Leads', listId: '4', input: 'CSV', enrichType: 'Mix + Personal', contacts: 412, found: 387, status: 'completed', progress: 100, started: '3 days ago' },
	];
</script>

<div class="flex h-full flex-col overflow-auto">
	<div class="flex justify-center pt-20">
		<div class="mx-8 w-full max-w-[1050px]">
			<!-- Header -->
			<div class="relative flex items-start justify-between pb-6">
				{#if mode !== ''}
					<button
						class="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg"
						onclick={() => { mode = ''; }}
					>
						<span class="material-icons-round text-grey-600 text-xl">arrow_back</span>
					</button>
				{/if}
				<h1 class="text-grey-900 text-2xl font-semibold" style:transform={mode ? 'translateX(8px)' : ''}>
					{version === 'v2' ? 'Emails & Phones' : 'New Enrichment'}
				</h1>
				<div class="text-grey-500 flex items-center gap-1.5 text-sm">
					<span class="material-icons-round text-base">timelapse</span>
					Contacts are stored 3 months
				</div>
			</div>

			<!-- Enrichment type selector (shown when mode is selected, or always in v2 before mode) -->
			{#if mode !== '' || (version === 'v2' && mode === '')}
				<div class="mb-6 flex gap-3">
					{#each [
						{ id: 'mix', label: 'Mix', icon: 'auto_awesome' },
						{ id: 'phone', label: 'Phone', icon: 'phone' },
						{ id: 'email', label: 'Email', icon: 'email' },
					] as type}
						<button
							class="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors"
							class:border-violet-200={enrichType === type.id}
							class:bg-violet-50={enrichType === type.id}
							class:text-violet-800={enrichType === type.id}
							class:border-grey-200={enrichType !== type.id}
							class:text-grey-700={enrichType !== type.id}
							onclick={() => { enrichType = type.id as typeof enrichType; }}
						>
							<span class="material-icons-round text-base">{type.icon}</span>
							{type.label}
						</button>
					{/each}
					{#if version === 'v2'}
						<label
							class="flex h-11 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border text-sm font-medium transition-colors {personalEmail ? 'border-pink-200 bg-pink-50 text-pink-800' : 'border-grey-200 text-grey-700'}"
						>
							<input type="checkbox" class="sr-only" bind:checked={personalEmail} />
							<span class="material-icons-round text-base">person</span>
							Personal Email
						</label>
					{/if}
				</div>
			{/if}

			<!-- Mode Selection -->
			{#if mode === ''}
				<div class="flex gap-4">
					<button
						class="border-grey-200 hover:border-violet-200 hover:bg-violet-50 flex flex-1 flex-col items-center gap-3 rounded-2xl border p-8 transition-colors"
						onclick={() => { mode = 'csv'; }}
					>
						<span class="material-icons-round text-violet-700 text-3xl">upload_file</span>
						<span class="text-grey-900 font-semibold">Enrich CSV / Excel</span>
						<span class="text-grey-500 text-sm">Upload a file with contacts to enrich</span>
					</button>
					<button
						class="border-grey-200 hover:border-violet-200 hover:bg-violet-50 flex flex-1 flex-col items-center gap-3 rounded-2xl border p-8 transition-colors"
						onclick={() => { mode = 'manual'; }}
					>
						<span class="material-icons-round text-violet-700 text-3xl">edit_note</span>
						<span class="text-grey-900 font-semibold">Enrich manually</span>
						<span class="text-grey-500 text-sm">Add contacts one by one</span>
					</button>
				</div>

				<!-- V2: Recent jobs (tracks process, not results) -->
				{#if version === 'v2'}
					<div class="mt-12 mb-20">
						<div class="flex items-center justify-between">
							<h2 class="text-grey-900 text-lg font-semibold">Recent Jobs</h2>
							<span class="text-grey-500 text-sm">{jobs.filter(j => j.status === 'running').length} running</span>
						</div>
						<div class="border-grey-200 mt-4 overflow-hidden rounded-xl border">
							{#each jobs as job, i}
								<div
									class="hover:bg-grey-50 flex items-center gap-4 px-5 py-4 transition-colors"
									class:border-grey-100={i < jobs.length - 1}
									class:border-b={i < jobs.length - 1}
								>
									<!-- Status icon -->
									<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg {job.status === 'running' ? 'bg-amber-50' : job.status === 'queued' ? 'bg-grey-100' : 'bg-emerald-50'}">
										<span class="material-icons-round text-lg {job.status === 'running' ? 'text-amber-600' : job.status === 'queued' ? 'text-grey-500' : 'text-emerald-600'}">
											{job.status === 'running' ? 'sync' : job.status === 'queued' ? 'schedule' : 'check_circle'}
										</span>
									</div>

									<!-- Job info -->
									<div class="min-w-0 flex-1">
										<div class="flex items-center gap-2">
											<p class="text-grey-900 truncate text-sm font-medium">{job.list}</p>
											<span class="text-grey-400 text-xs">&middot;</span>
											<span class="text-grey-500 text-xs">{job.input}</span>
											<span class="text-grey-400 text-xs">&middot;</span>
											<span class="text-grey-500 text-xs">{job.enrichType}</span>
										</div>
										<div class="mt-1.5 flex items-center gap-3">
											<div class="bg-grey-200 h-1.5 w-32 overflow-hidden rounded-full">
												<div
													class="h-full rounded-full transition-all {job.status === 'running' ? 'bg-amber-500' : job.status === 'queued' ? 'bg-grey-400' : 'bg-emerald-500'}"
													style:width="{job.progress}%"
												></div>
											</div>
											<span class="text-grey-500 text-xs">
												{#if job.status === 'queued'}
													Queued
												{:else}
													{job.found}/{job.contacts} found
												{/if}
											</span>
										</div>
									</div>

									<!-- Time + action -->
									<div class="flex shrink-0 items-center gap-3">
										<span class="text-grey-400 text-xs">{job.started}</span>
										{#if job.status === 'completed'}
											<a href="{base}/app/prospects/{job.listId}" class="btn-ghost flex h-7 items-center gap-1 px-2 text-xs text-violet-700">
												View in Lists
												<span class="material-icons-round text-sm">arrow_forward</span>
											</a>
										{:else if job.status === 'running'}
											<span class="inline-flex h-6 items-center rounded-full bg-amber-50 px-2.5 text-xs font-medium text-amber-700">{job.progress}%</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>

				<!-- V1: old enrichment history (lists inside enrich section) -->
				{:else}
					<div class="mt-12">
						<h2 class="text-grey-900 text-xl font-semibold">Contact List</h2>
						<div class="mt-6 flex items-center gap-2">
							{#each ['All Lists', 'Contact Lists', 'CSV Files'] as tab, i}
								<button
									class="h-8 rounded-full px-3 text-sm font-medium transition-colors"
									class:bg-grey-100={i === 0}
									class:text-grey-900={i === 0}
									class:text-grey-600={i !== 0}
								>
									{tab}
								</button>
							{/each}
						</div>
						<div class="mt-4 mb-20">
							{#each v1Enrichments as enrich}
								<div class="border-grey-100 hover:bg-grey-50 flex items-center justify-between border-b px-4 py-4 transition-colors">
									<div class="flex items-center gap-4">
										<div class="bg-violet-50 flex h-10 w-10 items-center justify-center rounded-lg">
											<span class="material-icons-round text-violet-700 text-lg">
												{enrich.type === 'CSV' ? 'description' : enrich.type === 'LinkedIn' ? 'link' : 'edit'}
											</span>
										</div>
										<div>
											<p class="text-grey-900 text-sm font-medium">{enrich.name}</p>
											<p class="text-grey-500 text-xs">{enrich.type} &middot; {enrich.date}</p>
										</div>
									</div>
									<div class="flex items-center gap-6">
										<div class="text-right">
											<p class="text-grey-900 text-sm font-medium">{enrich.found}/{enrich.contacts}</p>
											<p class="text-grey-500 text-xs">contacts found</p>
										</div>
										{#if enrich.status === 'completed'}
											<span class="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2.5 text-xs font-medium text-emerald-700">Completed</span>
										{:else}
											<span class="inline-flex h-6 items-center rounded-full bg-amber-50 px-2.5 text-xs font-medium text-amber-700">Running</span>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

			{:else}
				<!-- Input area -->
				<div class="border-grey-200 rounded-2xl border p-6">
					{#if mode === 'csv'}
						<div class="border-grey-300 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-16 transition-colors hover:border-violet-300 hover:bg-violet-50/20">
							<span class="material-icons-round text-grey-400 text-5xl">cloud_upload</span>
							<p class="text-grey-700 mt-4 font-medium">Drop your CSV or Excel file here</p>
							<p class="text-grey-500 mt-1 text-sm">Supports .csv, .xlsx — up to 64,000 contacts</p>
							<button class="btn-primary mt-4 h-10 px-4 text-sm">Select File</button>
						</div>
					{:else}
						<div class="flex flex-col gap-3">
							{#each [1, 2, 3] as _}
								<div class="border-grey-200 flex gap-3 rounded-lg border p-3">
									<input class="input h-9 flex-1 text-sm" placeholder="First name" />
									<input class="input h-9 flex-1 text-sm" placeholder="Last name" />
									<input class="input h-9 flex-1 text-sm" placeholder="Company" />
									<input class="input h-9 flex-1 text-sm" placeholder="LinkedIn URL" />
									<button class="btn-ghost h-9 w-9 shrink-0 p-0">
										<span class="material-icons-round text-grey-400 text-base">close</span>
									</button>
								</div>
							{/each}
							<button class="btn-ghost flex h-8 items-center gap-1.5 self-start text-sm">
								<span class="material-icons-round text-base">add</span>
								Add Contact
							</button>
						</div>
					{/if}
				</div>

				<!-- Destination + Start (v2 only) -->
				{#if version === 'v2'}
					<div class="border-grey-200 mt-6 mb-20 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
						<div class="flex items-center gap-4">
							<div class="flex items-center gap-2">
								<span class="material-icons-round text-grey-500 text-base">folder</span>
								<select class="input h-9 text-sm">
									<option>Create new list...</option>
									<option>SaaS Founders Q1</option>
									<option>VP Sales Software</option>
								</select>
							</div>
						</div>
						<button class="btn-primary h-10 gap-1.5 px-4 text-sm font-semibold" onclick={() => toast.show('Enrichment started')}>
							<span class="material-icons-round text-sm text-white">auto_awesome</span>
							Start Enrichment
						</button>
					</div>
				{:else}
					<div class="h-20"></div>
				{/if}
			{/if}
		</div>
	</div>
</div>
