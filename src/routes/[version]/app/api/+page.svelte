<script lang="ts">
	let showKey = $state(false);
	let copied = $state(false);

	const apiKey = 'fe_sk_1234-xxxx-xxxx-xxxx-xxxxxxxx';
	const maskedKey = 'fe_s-\u2022\u2022\u2022\u2022-\u2022\u2022\u2022\u2022-\u2022\u2022\u2022\u2022-\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022';

	function copyKey() {
		navigator.clipboard.writeText(apiKey);
		copied = true;
		setTimeout(() => { copied = false; }, 2000);
	}

	const apiEnrichments = [
		{ name: 'HubSpot Sync', contacts: 89, found: 76, status: 'completed', date: 'Feb 20, 2025' },
		{ name: 'Clay Workflow', contacts: 234, found: 198, status: 'completed', date: 'Feb 18, 2025' },
		{ name: 'Make Automation', contacts: 45, found: 38, status: 'completed', date: 'Feb 10, 2025' },
		{ name: 'Direct API Call', contacts: 12, found: 10, status: 'completed', date: 'Jan 28, 2025' },
	];
</script>

<div class="flex h-full justify-around overflow-auto">
	<div class="m-auto flex w-full flex-1 flex-col justify-start px-12 pt-16 xl:max-w-[1240px] xl:px-0">
		<!-- API Key Hero Card -->
		<div class="rounded-2xl px-8 py-6" style="background: radial-gradient(ellipse at 10% 90%, rgba(219,219,255,0.5), transparent 50%), radial-gradient(ellipse at 90% 10%, rgba(209,204,255,0.3), transparent 50%), #F7F6FE;">
			<div class="flex items-start gap-6">
				<div class="rounded-[77px] border border-[#e1e0e7] bg-white p-[5px] shadow">
					<div class="flex h-[46px] w-[46px] items-center justify-center rounded-[34.50px]" style="background: linear-gradient(135deg, #dbdbff, #e6e5ff, #d1ccff);">
						<span class="material-icons-round text-violet-700 text-xl">key</span>
					</div>
				</div>
				<div class="flex-1">
					<h1 class="text-grey-900 text-xl font-semibold">API key</h1>
					<p class="text-grey-600 mt-1 text-sm">
						Use your API key to connect FullEnrich with your favorite tools
					</p>

					<div class="mt-4 flex items-center gap-2">
						<div class="input flex h-10 min-w-[400px] items-center rounded-lg border py-2.5 pr-1 pl-4">
							<span class="text-grey-700 flex-1 font-mono text-sm">
								{showKey ? apiKey : maskedKey}
							</span>
							<button
								class="btn-tertiary flex h-8 w-8 items-center justify-center"
								onclick={() => { showKey = !showKey; }}
							>
								<span class="material-icons-round text-grey-600 text-lg">
									{showKey ? 'visibility_off' : 'visibility'}
								</span>
							</button>
						</div>
						<button class="btn-ghost inline-flex h-10 items-center gap-2.5 px-3" onclick={copyKey}>
							<span class="material-icons-round text-grey-600 text-base">content_copy</span>
							{copied ? 'Copied!' : 'Copy'}
						</button>
						<button class="btn-tertiary inline-flex items-center gap-1 rounded-lg py-2 pr-3 pl-2.5 text-sm">
							<span class="material-icons-round text-grey-600 text-base">refresh</span>
							Regenerate
						</button>
					</div>

					<a href="#docs" class="mt-9 flex items-center gap-1 text-sm font-medium text-violet-700">
						<span class="material-icons-round text-base">book</span>
						See FullEnrich API Documentation
					</a>
				</div>
			</div>
		</div>

		<!-- API Enrichments List -->
		<div class="mt-12">
			<h2 class="text-grey-900 text-xl font-semibold">Enrichments made by API & Zapier</h2>

			<div class="mt-6">
				{#each apiEnrichments as enrich}
					<div class="border-grey-100 hover:bg-grey-50 flex items-center justify-between border-b px-4 py-4 transition-colors">
						<div class="flex items-center gap-4">
							<div class="bg-violet-50 flex h-10 w-10 items-center justify-center rounded-lg">
								<span class="material-icons-round text-violet-700 text-lg">api</span>
							</div>
							<div>
								<p class="text-grey-900 text-sm font-medium">{enrich.name}</p>
								<p class="text-grey-500 text-xs">{enrich.date}</p>
							</div>
						</div>
						<div class="flex items-center gap-6">
							<div class="text-right">
								<p class="text-grey-900 text-sm font-medium">{enrich.found}/{enrich.contacts}</p>
								<p class="text-grey-500 text-xs">contacts found</p>
							</div>
							<span class="inline-flex h-6 items-center rounded-full bg-emerald-50 px-2.5 text-xs font-medium text-emerald-700">Completed</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="h-20"></div>
	</div>
</div>
