<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { page } from '$app/stores';
	let base = $derived(`${svelteBase}/${$page.params.version}`);
</script>

<div class="flex h-full flex-col items-center justify-center p-8">
	<div class="w-full max-w-[600px]">
		<h2 class="text-grey-900 text-xl font-semibold">Upload CSV / Excel</h2>
		<p class="text-grey-600 mt-1 text-sm">Upload a file with contacts to enrich. Results will be saved to your selected list in Prospects.</p>

		<!-- Drop zone -->
		<div class="border-grey-300 mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-8 py-16 transition-colors hover:border-violet-300 hover:bg-violet-50/20">
			<span class="material-icons-round text-grey-400 text-5xl">cloud_upload</span>
			<p class="text-grey-700 mt-4 font-medium">Drop your CSV or Excel file here</p>
			<p class="text-grey-500 mt-1 text-sm">Supports .csv, .xlsx — up to 64,000 contacts</p>
			<button class="btn-primary mt-4 h-10 px-4 text-sm">Select File</button>
		</div>

		<!-- Format guidance -->
		<div class="mt-8">
			<h3 class="text-grey-900 text-base font-semibold">Fields Formatting</h3>
			<div class="mt-4 flex justify-between gap-8">
				<div>
					<p class="text-grey-600 mb-2 text-sm font-medium">Company name & Website</p>
					<div class="flex flex-col gap-1.5">
						<div class="flex items-center gap-2 text-sm">
							<span class="material-icons-round text-emerald-600 text-base">check</span>
							<span class="text-grey-700">Stripe</span>
						</div>
						<div class="flex items-center gap-2 text-sm">
							<span class="material-icons-round text-emerald-600 text-base">check</span>
							<span class="text-grey-700">stripe.com</span>
						</div>
					</div>
				</div>
				<div>
					<p class="text-grey-600 mb-2 text-sm font-medium">LinkedIn Profile URL</p>
					<div class="flex flex-col gap-1.5">
						<div class="flex items-center gap-2 text-sm">
							<span class="material-icons-round text-emerald-600 text-base">check</span>
							<span class="text-grey-700">linkedin.com/in/username</span>
						</div>
						<div class="flex items-center gap-2 text-sm">
							<span class="material-icons-round text-emerald-600 text-base">check</span>
							<span class="text-grey-700">https://www.linkedin.com/in/username</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Info banner -->
		<div class="mt-6 flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/50 px-4 py-3">
			<span class="material-icons-round text-violet-700 mt-0.5 text-base">info</span>
			<p class="text-grey-700 text-sm">After upload, you'll map your columns and review contacts before enrichment starts. Results go directly to your Prospects list.</p>
		</div>
	</div>
</div>
