<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	import { toast } from '$lib/toast.svelte';
	import { v6Store } from '$lib/mock/v6.svelte';
	import ExportPopover from '$lib/components/ExportPopover.svelte';
	import type { EmailStatus } from '$lib/mock/v6.svelte';

	let version = $derived($page.params.version);
	let base = $derived(`${svelteBase}/${version}`);
	let jobId = $derived($page.params.jobId);

	let job = $derived(v6Store.getJob(jobId));

	// Editable job name
	let editingName = $state(false);
	let nameInput = $state('');

	function startEditName() {
		nameInput = job?.name ?? '';
		editingName = true;
	}

	function saveName() {
		if (!job) return;
		const trimmed = nameInput.trim();
		if (trimmed && trimmed !== job.name) {
			(job as any).name = trimmed;
			toast.show('Name updated');
		}
		editingName = false;
	}

	function handleNameKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') saveName();
		if (e.key === 'Escape') editingName = false;
	}

	// Export popover
	let exportOpen = $state(false);

	// Add to list popover
	let addListOpen = $state(false);
	const peopleLists = $derived(v6Store.lists.filter(l => l.type === 'people'));

	// Per-row add-to-list popover
	let rowAddListContactId = $state('');

	// Source icons / labels
	const sourceIcons: Record<string, string> = {
		csv: 'upload_file',
		manual: 'edit_note',
		reverse: 'swap_horiz',
		crm: 'hub',
		'search-batch': 'search',
		'search-inline': 'person_search',
	};

	const sourceLabels: Record<string, string> = {
		csv: 'CSV',
		manual: 'Manual',
		reverse: 'Reverse',
		crm: 'CRM',
		'search-batch': 'Search batch',
		'search-inline': 'Search',
	};

	// Status badge helpers
	function statusBadgeClass(status: string) {
		if (status === 'running') return 'bg-amber-50 text-amber-700';
		if (status === 'queued') return 'bg-grey-100 text-grey-500';
		if (status === 'completed-errors') return 'bg-orange-50 text-orange-700';
		return 'bg-emerald-50 text-emerald-700';
	}

	function statusLabel(status: string) {
		if (status === 'running') return 'Running';
		if (status === 'queued') return 'Queued';
		if (status === 'completed-errors') return 'Completed with errors';
		return 'Completed';
	}

	// Email status chip
	const emailStatusMap: Record<EmailStatus, { label: string; cls: string }> = {
		valid: { label: 'Valid', cls: 'text-emerald-700 bg-emerald-50' },
		'catch-all': { label: 'Catch-all', cls: 'text-amber-700 bg-amber-50' },
		'invalid-found': { label: 'Found but invalid', cls: 'text-orange-700 bg-orange-50' },
		'not-found': { label: 'Not found', cls: 'text-grey-600 bg-grey-100' },
		pending: { label: 'Pending', cls: 'text-blue-700 bg-blue-50' },
	};

	// Per-contact status: enriched if email or phone present
	function contactRowStatus(email: string, phone: string, emailStatus: EmailStatus) {
		if (emailStatus === 'pending') return 'pending';
		if (email || phone) return 'enriched';
		return 'not-found';
	}
</script>

{#if version === 'v6'}
	{#if job}
		<div class="flex h-full flex-col">
			<!-- Header bar -->
			<div class="border-grey-200 flex h-14 shrink-0 items-center justify-between border-b px-6">
				<div class="flex items-center gap-3 min-w-0">
					<!-- Back -->
					<a
						href="{base}/app/enrich"
						class="btn-ghost flex h-8 w-8 shrink-0 items-center justify-center rounded-lg p-0"
					>
						<span class="material-icons-round text-grey-600 text-lg">arrow_back</span>
					</a>

					<!-- Source icon -->
					<div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50">
						<span class="material-icons-round text-violet-600 text-base">{sourceIcons[job.source] ?? 'work'}</span>
					</div>

					<!-- Editable name -->
					{#if editingName}
						<input
							class="input h-8 w-64 text-sm font-semibold"
							bind:value={nameInput}
							onkeydown={handleNameKeydown}
							onblur={saveName}
							autofocus
						/>
					{:else}
						<button
							class="text-grey-900 text-base font-semibold hover:text-violet-700 transition-colors truncate max-w-xs"
							onclick={startEditName}
							title="Click to rename"
						>
							{job.name}
						</button>
					{/if}

					<!-- Status badge -->
					<span class="inline-flex h-6 shrink-0 items-center rounded-full px-2.5 text-xs font-medium {statusBadgeClass(job.status)}">
						{statusLabel(job.status)}
					</span>

					<!-- Progress -->
					{#if job.status === 'running'}
						<div class="flex items-center gap-2 shrink-0">
							<div class="bg-grey-200 h-1.5 w-24 overflow-hidden rounded-full">
								<div class="bg-amber-400 h-full rounded-full transition-all" style:width="{job.progress}%"></div>
							</div>
							<span class="text-grey-500 text-xs">{job.progress}%</span>
						</div>
					{/if}

					<!-- Date -->
					<span class="text-grey-400 text-xs shrink-0">{job.date}</span>
				</div>

				<!-- Header actions -->
				<div class="flex shrink-0 items-center gap-2">
					<span class="text-grey-500 text-sm">{job.contacts.length} contacts</span>

					<!-- Export -->
					<div class="relative">
						<button
							class="btn-ghost h-8 gap-1.5 px-3 text-sm"
							onclick={() => { exportOpen = !exportOpen; addListOpen = false; }}
						>
							<span class="material-icons-round text-grey-600 text-base">download</span>
							Export
							<span class="material-icons-round text-grey-400 text-xs">expand_more</span>
						</button>
						<ExportPopover bind:open={exportOpen} count={job.contacts.length} sourceName={job.name} />
					</div>

					<!-- Add to list -->
					<div class="relative">
						<button
							class="btn-ghost h-8 gap-1.5 px-3 text-sm"
							onclick={() => { addListOpen = !addListOpen; exportOpen = false; }}
						>
							<span class="material-icons-round text-grey-600 text-base">playlist_add</span>
							Add to list
						</button>
						{#if addListOpen}
							<button class="fixed inset-0 z-20" onclick={() => { addListOpen = false; }} aria-label="Close"></button>
							<div class="absolute right-0 top-full z-30 mt-1 w-52 rounded-xl border border-grey-200 bg-white p-1.5 shadow-lg">
								{#each peopleLists as list}
									<button
										class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800"
										onclick={() => { addListOpen = false; toast.show('8 added, 2 duplicates skipped'); }}
									>
										<span class="material-icons-round text-grey-400 text-base">folder</span>
										{list.name}
									</button>
								{/each}
							</div>
						{/if}
					</div>

					<!-- Open in new tab -->
					<a
						href="{base}/app/enrich/{job.id}"
						target="_blank"
						class="btn-ghost flex h-8 w-8 items-center justify-center rounded-lg p-0"
						title="Open in new tab"
					>
						<span class="material-icons-round text-grey-500 text-base">open_in_new</span>
					</a>
				</div>
			</div>

			<!-- Contact table -->
			<div class="flex-1 overflow-auto">
				<table class="w-full min-w-[1200px]">
					<thead class="sticky top-0 z-10">
						<tr class="table-header">
							<th class="text-grey-600 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider">Name</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Professional email</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Phone</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Personal email</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
							<th class="text-grey-600 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody class="bg-white">
						{#each job.contacts as contact}
							{@const rowStatus = contactRowStatus(contact.email, contact.phone, contact.emailStatus)}
							{@const emailChip = emailStatusMap[contact.emailStatus]}
							<tr class="border-grey-100 hover:bg-grey-50 border-b transition-colors group">
								<!-- Name -->
								<td class="px-5 py-3">
									<div>
										<p class="text-grey-900 text-sm font-medium">{contact.firstName} {contact.lastName}</p>
										{#if contact.linkedinUrl}
											<a
												href="https://{contact.linkedinUrl}"
												target="_blank"
												class="text-grey-400 hover:text-violet-600 font-mono text-xs transition-colors"
											>{contact.linkedinUrl.replace('linkedin.com/in/', 'in/')}</a>
										{/if}
									</div>
								</td>

								<!-- Company -->
								<td class="px-4 py-3">
									<div>
										<p class="text-grey-800 text-sm">{contact.company}</p>
										{#if contact.location}
											<p class="text-grey-400 text-xs">{contact.location}</p>
										{/if}
									</div>
								</td>

								<!-- Title -->
								<td class="px-4 py-3">
									<p class="text-grey-700 text-sm">{contact.title}</p>
								</td>

								<!-- Professional email + status chip -->
								<td class="px-4 py-3">
									<div class="flex flex-col gap-1">
										{#if contact.email}
											<span class="text-grey-900 font-mono text-xs">{contact.email}</span>
										{:else}
											<span class="text-grey-300 text-xs">—</span>
										{/if}
										<span class="inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium {emailChip.cls}">
											{emailChip.label}
										</span>
									</div>
								</td>

								<!-- Phone -->
								<td class="px-4 py-3">
									{#if contact.phone}
										<span class="text-grey-900 font-mono text-xs">{contact.phone}</span>
									{:else}
										<span class="text-grey-300 text-xs">—</span>
									{/if}
								</td>

								<!-- Personal email -->
								<td class="px-4 py-3">
									{#if contact.personalEmail}
										<span class="text-grey-900 font-mono text-xs">{contact.personalEmail}</span>
									{:else}
										<span class="text-grey-300 text-xs">—</span>
									{/if}
								</td>

								<!-- Row status -->
								<td class="px-4 py-3">
									{#if rowStatus === 'enriched'}
										<span class="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Enriched</span>
									{:else if rowStatus === 'pending'}
										<span class="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">Pending</span>
									{:else}
										<span class="inline-flex items-center rounded-full bg-grey-100 px-2 py-0.5 text-xs font-medium text-grey-500">Not found</span>
									{/if}
								</td>

								<!-- Per-row actions -->
								<td class="px-4 py-3">
									<div class="relative flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
										<button
											class="btn-ghost flex h-7 items-center gap-1 px-2 text-xs"
											onclick={() => { rowAddListContactId = rowAddListContactId === contact.id ? '' : contact.id; }}
										>
											<span class="material-icons-round text-grey-500 text-sm">playlist_add</span>
											Add to list
										</button>
										{#if rowAddListContactId === contact.id}
											<button class="fixed inset-0 z-20" onclick={() => { rowAddListContactId = ''; }} aria-label="Close"></button>
											<div class="absolute left-0 top-full z-30 mt-1 w-52 rounded-xl border border-grey-200 bg-white p-1.5 shadow-lg">
												{#each peopleLists as list}
													<button
														class="hover:bg-grey-50 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-grey-800"
														onclick={() => { rowAddListContactId = ''; toast.show(`${contact.firstName} ${contact.lastName} added to "${list.name}"`); }}
													>
														<span class="material-icons-round text-grey-400 text-base">folder</span>
														{list.name}
													</button>
												{/each}
											</div>
										{/if}
									</div>
								</td>
							</tr>
						{/each}

						{#if job.contacts.length === 0}
							<tr>
								<td colspan="8">
									<div class="flex flex-col items-center justify-center gap-2 py-20">
										<span class="material-icons-round text-grey-300 text-4xl">person_off</span>
										<p class="text-grey-500 text-sm">No contacts in this job yet.</p>
									</div>
								</td>
							</tr>
						{/if}
					</tbody>
				</table>
			</div>
		</div>
	{:else}
		<!-- Job not found -->
		<div class="flex h-full flex-col items-center justify-center gap-4">
			<span class="material-icons-round text-grey-300 text-5xl">search_off</span>
			<p class="text-grey-600 text-base font-medium">Job not found</p>
			<a href="{base}/app/enrich" class="btn-primary h-9 px-4 text-sm">Back to Enrichment</a>
		</div>
	{/if}
{:else}
	<!-- Not available in other versions -->
	<div class="flex h-full items-center justify-center">
		<p class="text-grey-400 text-sm">This page is only available in V6.</p>
	</div>
{/if}
