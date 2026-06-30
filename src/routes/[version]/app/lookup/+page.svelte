<script lang="ts">
	const lookups = [
		{ name: 'March Campaign Leads', total: 45, found: 38, phones: 12, emails: 34, date: 'Mar 5, 2025' },
		{ name: 'Event Attendees', total: 120, found: 98, phones: 45, emails: 89, date: 'Feb 28, 2025' },
		{ name: 'Newsletter Subscribers', total: 67, found: 52, phones: 8, emails: 52, date: 'Feb 15, 2025' },
	];
</script>

<div class="bg-grey-50 h-[calc(100vh-65px)] w-full overflow-auto p-2">
	<div class="border-grey-200 min-h-full rounded-2xl border bg-white p-8">
		<div class="mx-auto max-w-[1050px]">
			<section class="flex flex-col gap-8 py-6">
				<!-- Feature Card -->
				<div class="border-grey-100 relative flex items-center gap-6 overflow-hidden rounded-xl border px-8 py-6 shadow" style="background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%);">
					<div class="flex-1">
						<span class="inline-flex items-center gap-1 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800">
							<span class="material-icons-round text-sm">auto_awesome</span>
							Reverse Email Lookup
						</span>
						<h1 class="text-grey-900 mt-3 text-2xl font-semibold">Find people behind email addresses</h1>
						<p class="text-grey-600 mt-2 text-sm">Upload a list of email addresses and discover the people behind them — names, job titles, companies, and more.</p>
					</div>
					<div class="flex h-32 w-32 shrink-0 items-center justify-center">
						<span class="material-icons-round text-violet-300" style="font-size: 96px;">person_search</span>
					</div>
				</div>

				<!-- Lookups List -->
				<div>
					<!-- Header -->
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							{#each ['My lookups', 'All lookups'] as tab, i}
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
						<button class="btn-primary h-8 gap-1.5 px-3 text-sm">
							<span class="material-icons-round text-sm text-white">add</span>
							New Lookup
						</button>
					</div>

					<!-- List -->
					<div class="mt-4">
						{#each lookups as lookup}
							<div class="border-grey-100 hover:bg-grey-50 flex cursor-pointer items-center justify-between rounded-lg border-b px-4 py-4 transition-colors">
								<div class="flex items-center gap-4">
									<div class="bg-violet-50 flex h-10 w-10 items-center justify-center rounded-lg">
										<span class="material-icons-round text-violet-700 text-lg">person_search</span>
									</div>
									<div>
										<p class="text-grey-900 text-sm font-medium">{lookup.name}</p>
										<p class="text-grey-500 text-xs">{lookup.date}</p>
									</div>
								</div>
								<div class="flex items-center gap-4">
									<div class="flex items-center gap-3">
										<span class="bg-grey-100 text-grey-700 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs">
											{lookup.found}/{lookup.total} found
										</span>
										<span class="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
											<span class="material-icons-round text-xs">email</span>
											{lookup.emails}
										</span>
										<span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">
											<span class="material-icons-round text-xs">phone</span>
											{lookup.phones}
										</span>
									</div>
									<span class="material-icons-round text-grey-400 text-lg">chevron_right</span>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</section>
		</div>
	</div>
</div>
