<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';
	let base = $derived(`${svelteBase}/${$page.params.version}`);
	let emailInput = $state('');

	const reverseJobs = [
		{ id: 'rj1', list: 'Newsletter Reverse Lookup', listId: '6', emails: 67, found: 52, status: 'completed' as const, progress: 100, started: '2 weeks ago' },
		{ id: 'rj2', list: 'Webinar Attendees', listId: '1', emails: 145, found: 89, status: 'running' as const, progress: 61, started: '20 min ago' },
		{ id: 'rj3', list: 'Inbound Leads June', listId: '4', emails: 34, found: 28, status: 'completed' as const, progress: 100, started: '5 days ago' },
	];
</script>

<div class="flex h-full flex-col overflow-auto">
	<div class="flex justify-center pt-20">
		<div class="mx-8 w-full max-w-[1050px]">
			<div class="flex items-start justify-between pb-6">
				<div>
					<h1 class="text-grey-900 text-2xl font-semibold">Reverse Lookup</h1>
					<p class="text-grey-600 mt-1 text-sm">Find the B2B profile behind email addresses — name, job title, company, LinkedIn, seniority.</p>
				</div>
				<div class="text-grey-500 flex items-center gap-1.5 text-sm">
					<span class="material-icons-round text-amber-500 text-base">stars</span>
					1 credit per person found
				</div>
			</div>

			<!-- Input mode selector -->
			<div class="mb-6 flex gap-3">
				<button class="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 text-sm font-medium text-violet-800">
					<span class="material-icons-round text-base">content_paste</span>
					Paste emails
				</button>
				<button class="border-grey-200 text-grey-700 flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border text-sm font-medium">
					<span class="material-icons-round text-base">upload_file</span>
					Upload CSV
				</button>
			</div>

			<!-- Paste area -->
			<div class="border-grey-200 rounded-2xl border p-6">
				<label for="reverse-emails" class="text-grey-700 mb-2 block text-sm font-medium">Email addresses</label>
				<textarea
					id="reverse-emails"
					class="input min-h-[200px] w-full resize-y p-3 font-mono text-sm"
					placeholder="sarah@stripe.com&#10;james@hubspot.com&#10;emma@datadoghq.com&#10;&#10;One email per line or comma-separated"
					bind:value={emailInput}
				></textarea>
			</div>

			<!-- Optional enrichment add-ons -->
			<div class="mt-6">
				<p class="text-grey-700 mb-3 text-sm font-medium">Also enrich with (optional)</p>
				<div class="flex gap-3">
					<label class="border-grey-200 hover:border-violet-200 flex flex-1 cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors">
						<input type="checkbox" />
						<div>
							<p class="text-grey-900 text-sm font-medium">Professional email</p>
							<p class="text-grey-500 text-xs">+1 credit per contact</p>
						</div>
					</label>
					<label class="border-grey-200 hover:border-violet-200 flex flex-1 cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors">
						<input type="checkbox" />
						<div>
							<p class="text-grey-900 text-sm font-medium">Phone number</p>
							<p class="text-grey-500 text-xs">+1 credit per contact</p>
						</div>
					</label>
				</div>
			</div>

			<!-- Destination + Start -->
			<div class="border-grey-200 mt-6 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-2">
						<span class="material-icons-round text-grey-500 text-base">folder</span>
						<select class="input h-9 text-sm">
							<option>Create new list...</option>
							<option>SaaS Founders Q1</option>
							<option>VP Sales Software</option>
						</select>
					</div>
					<div class="text-grey-500 text-xs">You only pay for people we find</div>
				</div>
				<button class="btn-primary h-10 px-4 text-sm font-semibold" onclick={() => toast.show('Reverse lookup started')}>
					Start Lookup
				</button>
			</div>

			<!-- Recent Jobs -->
			<div class="mt-10 mb-20">
				<div class="flex items-center justify-between">
					<h2 class="text-grey-900 text-lg font-semibold">Recent Jobs</h2>
					<span class="text-grey-500 text-sm">{reverseJobs.filter(j => j.status === 'running').length} running</span>
				</div>
				<div class="border-grey-200 mt-4 overflow-hidden rounded-xl border">
					{#each reverseJobs as job, i}
						<div
							class="hover:bg-grey-50 flex items-center gap-4 px-5 py-4 transition-colors"
							class:border-grey-100={i < reverseJobs.length - 1}
							class:border-b={i < reverseJobs.length - 1}
						>
							<div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg {job.status === 'running' ? 'bg-amber-50' : 'bg-emerald-50'}">
								<span class="material-icons-round text-lg {job.status === 'running' ? 'text-amber-600' : 'text-emerald-600'}">
									{job.status === 'running' ? 'sync' : 'check_circle'}
								</span>
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<p class="text-grey-900 truncate text-sm font-medium">{job.list}</p>
									<span class="text-grey-400 text-xs">&middot;</span>
									<span class="text-grey-500 text-xs">Reverse Lookup</span>
								</div>
								<div class="mt-1.5 flex items-center gap-3">
									<div class="bg-grey-200 h-1.5 w-32 overflow-hidden rounded-full">
										<div
											class="h-full rounded-full transition-all {job.status === 'running' ? 'bg-amber-500' : 'bg-emerald-500'}"
											style:width="{job.progress}%"
										></div>
									</div>
									<span class="text-grey-500 text-xs">{job.found}/{job.emails} found</span>
								</div>
							</div>
							<div class="flex shrink-0 items-center gap-3">
								<span class="text-grey-400 text-xs">{job.started}</span>
								{#if job.status === 'completed'}
									<a href="{base}/app/prospects/{job.listId}" class="btn-ghost flex h-7 items-center gap-1 px-2 text-xs text-violet-700">
										View in Lists
										<span class="material-icons-round text-sm">arrow_forward</span>
									</a>
								{:else}
									<span class="inline-flex h-6 items-center rounded-full bg-amber-50 px-2.5 text-xs font-medium text-amber-700">{job.progress}%</span>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
