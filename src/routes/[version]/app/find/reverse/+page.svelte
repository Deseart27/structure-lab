<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	let base = $derived(`${svelteBase}/${$page.params.version}`);

	let emailInput = $state('');
</script>

<div class="flex h-full flex-col items-center overflow-auto p-8">
	<div class="w-full max-w-[600px]">
		<h2 class="text-grey-900 text-xl font-semibold">Reverse Email Lookup</h2>
		<p class="text-grey-600 mt-1 text-sm">Find people behind email addresses — names, job titles, companies, LinkedIn profiles. Results are saved to your Prospects list.</p>

		<div class="text-grey-700 mt-4 flex items-center gap-1.5 text-sm">
			<span class="material-icons-round text-amber-500 text-base">stars</span>
			1 credit per person found
		</div>

		<!-- Email input area -->
		<div class="mt-6">
			<label for="email-input" class="text-grey-700 mb-2 block text-sm font-medium">Email addresses</label>
			<textarea
				id="email-input"
				class="input min-h-[160px] w-full resize-y p-3 font-mono text-sm"
				placeholder="sarah@stripe.com&#10;james@hubspot.com&#10;emma@datadoghq.com&#10;&#10;One email per line or comma-separated"
				bind:value={emailInput}
			></textarea>
		</div>

		<!-- Or upload -->
		<div class="mt-4 flex items-center gap-4">
			<div class="border-grey-200 h-px flex-1"></div>
			<span class="text-grey-400 text-xs uppercase">or</span>
			<div class="border-grey-200 h-px flex-1"></div>
		</div>

		<button class="border-grey-200 hover:bg-grey-50 mt-4 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition-colors">
			<span class="material-icons-round text-grey-500 text-base">upload_file</span>
			<span class="text-grey-700 font-medium">Upload CSV with emails</span>
		</button>

		<!-- Bottom bar -->
		<div class="border-grey-200 mt-6 flex items-center justify-between rounded-xl border bg-white p-4 shadow-sm">
			<div>
				<p class="text-grey-900 text-sm font-medium">Maximum cost for 0 people</p>
				<p class="text-grey-500 text-xs">You only pay for people we successfully find</p>
			</div>
			<button class="btn-primary h-10 px-4 text-sm font-semibold">
				Start Lookup
			</button>
		</div>
	</div>
</div>
