<script lang="ts">
	import { base as svelteBase } from '$app/paths';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Navbar from '$lib/components/Navbar.svelte';
	import SubNav from '$lib/components/SubNav.svelte';
	import Toast from '$lib/components/Toast.svelte';
	let { children } = $props();

	let version = $derived($page.params.version);
	let basePath = $derived(`${svelteBase}/${version}`);

	// V7 onboarding — shown once per session
	let v7OnboardingDone = $state(false);
	let v7ShowOnboarding = $derived((version === 'v7' || version === 'v8') && !v7OnboardingDone);

	function v7PickUseCase(route: string) {
		v7OnboardingDone = true;
		goto(`${basePath}${route}`);
	}
</script>

{#if v7ShowOnboarding}
<!-- V7 Onboarding — last step: "What brings you to FullEnrich?" -->
<div class="flex min-h-screen min-w-screen flex-col bg-white">
	<Navbar />
	<div class="flex flex-1 items-center justify-center">
		<div class="mx-4 w-full max-w-4xl text-center">
			<div class="mb-2 flex justify-center">
				<span class="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">Last step</span>
			</div>
			<h1 class="text-grey-900 text-3xl font-bold tracking-tight">What do you want to do with FullEnrich?</h1>
			<p class="text-grey-500 mx-auto mt-3 max-w-lg text-base">Pick your main goal — we'll take you straight there. You can always explore everything later.</p>

			<div class="mt-10 grid grid-cols-2 gap-4 text-left">
				<!-- Find leads -->
				<button
					class="group flex items-start gap-4 rounded-2xl border-2 border-grey-200 bg-white p-6 shadow-sm transition-all hover:border-violet-400 hover:shadow-lg"
					onclick={() => v7PickUseCase('/app/search')}
				>
					<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 transition-colors group-hover:bg-violet-200">
						<span class="material-icons-round text-violet-700 text-2xl">person_search</span>
					</div>
					<div class="min-w-0 flex-1">
						<p class="text-grey-900 text-base font-bold">Find new leads</p>
						<p class="text-grey-500 mt-1 text-sm">Search our database of 700M+ contacts by company, title, location and more.</p>
						<div class="mt-3 flex flex-wrap items-center gap-1">
							<span class="text-grey-400 text-[10px] uppercase tracking-wider font-medium">via</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">
								<span class="material-icons-round text-[10px]">search</span>
								Search
							</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">
								<span class="material-icons-round text-[10px]">smart_toy</span>
								AI Prompt
							</span>
						</div>
					</div>
				</button>

				<!-- Enrich contacts -->
				<button
					class="group flex items-start gap-4 rounded-2xl border-2 border-grey-200 bg-white p-6 shadow-sm transition-all hover:border-blue-400 hover:shadow-lg"
					onclick={() => v7PickUseCase('/app/enrich')}
				>
					<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-200">
						<span class="material-icons-round text-blue-700 text-2xl">auto_awesome</span>
					</div>
					<div class="min-w-0 flex-1">
						<p class="text-grey-900 text-base font-bold">Find emails & phones</p>
						<p class="text-grey-500 mt-1 text-sm">Upload a file, enter names manually, or pull from your CRM — we'll find verified emails and direct dials.</p>
						<div class="mt-3 flex flex-wrap items-center gap-1">
							<span class="text-grey-400 text-[10px] uppercase tracking-wider font-medium">from</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">
								<span class="material-icons-round text-[10px]">upload_file</span>
								CSV
							</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">
								<span class="material-icons-round text-[10px]">edit_note</span>
								Manual
							</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">
								<svg class="h-2.5 w-2.5 shrink-0" viewBox="0 0 1024 1024"><circle cx="512" cy="512" r="512" fill="#FF7A59"/><path d="M623.8 624.94c-38.23 0-69.24-30.67-69.24-68.51s31-68.52 69.24-68.52 69.26 30.67 69.26 68.52-31 68.51-69.26 68.51m20.74-200.42v-61a46.83 46.83 0 0 0 27.33-42.29v-1.41c0-25.78-21.32-46.86-47.35-46.86h-1.43c-26 0-47.35 21.09-47.35 46.86v1.41a46.85 46.85 0 0 0 27.33 42.29v61a135.08 135.08 0 0 0-63.86 27.79l-169.1-130.17A52.49 52.49 0 0 0 372 309c0-29.21-23.89-52.92-53.4-53s-53.45 23.59-53.48 52.81 23.85 52.88 53.36 52.93a53.29 53.29 0 0 0 26.33-7.09l166.38 128.1a132.14 132.14 0 0 0 2.07 150.3l-50.62 50.1A43.42 43.42 0 1 0 450.1 768c24.24 0 43.9-19.46 43.9-43.45a42.24 42.24 0 0 0-2-12.42l50-49.52a135.28 135.28 0 0 0 81.8 27.47c74.61 0 135.06-59.83 135.06-133.65 0-66.82-49.62-122-114.33-131.91" fill="#fff" fill-rule="evenodd"/></svg>
								HubSpot
							</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">
								<svg class="h-2.5 w-2.5 shrink-0" viewBox="0 0 256 256"><path d="M143.37 77.73l42.07-42.07c1.73-1.73 1.73-4.53 0-6.26l-14.84-14.84c-1.73-1.73-4.53-1.73-6.26 0l-42.07 42.07c-18.12-10.53-39.2-14.08-59.6-9.98C28.43 54.03 3.6 82.8.37 117.58c-4.98 53.46 41.53 98.14 95.01 91.2 32.63-4.24 59.33-28.38 68.22-60.02 4.68-16.63 3.7-33.47-1.73-48.48L143.37 77.73zM82.08 173.58c-26.22 0-47.5-21.28-47.5-47.5s21.28-47.5 47.5-47.5 47.5 21.28 47.5 47.5-21.28 47.5-47.5 47.5z" fill="#00A1E0" transform="translate(30 22) scale(.9)"/></svg>
								Salesforce
							</span>
						</div>
					</div>
				</button>

				<!-- Reverse enrich -->
				<button
					class="group flex items-start gap-4 rounded-2xl border-2 border-grey-200 bg-white p-6 shadow-sm transition-all hover:border-teal-400 hover:shadow-lg"
					onclick={() => v7PickUseCase('/app/enrich')}
				>
					<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-100 transition-colors group-hover:bg-teal-200">
						<span class="material-icons-round text-teal-700 text-2xl">swap_horiz</span>
					</div>
					<div class="min-w-0 flex-1">
						<p class="text-grey-900 text-base font-bold">Reverse enrich my data</p>
						<p class="text-grey-500 mt-1 text-sm">Have emails already? Get full profiles — name, title, company, LinkedIn, phone.</p>
						<div class="mt-3 flex flex-wrap items-center gap-1">
							<span class="text-grey-400 text-[10px] uppercase tracking-wider font-medium">from</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">
								<span class="material-icons-round text-[10px]">upload_file</span>
								CSV
							</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">
								<span class="material-icons-round text-[10px]">content_paste</span>
								Paste emails
							</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">
								<span class="material-icons-round text-[10px]">api</span>
								API
							</span>
						</div>
						<span class="mt-2 inline-flex rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-semibold text-white">New</span>
					</div>
				</button>

				<!-- Enrich my CRM -->
				<button
					class="group flex items-start gap-4 rounded-2xl border-2 border-grey-200 bg-white p-6 shadow-sm transition-all hover:border-amber-400 hover:shadow-lg"
					onclick={() => v7PickUseCase('/app/integrations')}
				>
					<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-100 transition-colors group-hover:bg-amber-200">
						<span class="material-icons-round text-amber-700 text-2xl">hub</span>
					</div>
					<div class="min-w-0 flex-1">
						<p class="text-grey-900 text-base font-bold">Enrich my CRM</p>
						<p class="text-grey-500 mt-1 text-sm">Connect your CRM and keep your contacts enriched automatically.</p>
						<div class="mt-3 flex flex-wrap items-center gap-1">
							<span class="text-grey-400 text-[10px] uppercase tracking-wider font-medium">supports</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">
								<svg class="h-2.5 w-2.5 shrink-0" viewBox="0 0 1024 1024"><circle cx="512" cy="512" r="512" fill="#FF7A59"/><path d="M623.8 624.94c-38.23 0-69.24-30.67-69.24-68.51s31-68.52 69.24-68.52 69.26 30.67 69.26 68.52-31 68.51-69.26 68.51m20.74-200.42v-61a46.83 46.83 0 0 0 27.33-42.29v-1.41c0-25.78-21.32-46.86-47.35-46.86h-1.43c-26 0-47.35 21.09-47.35 46.86v1.41a46.85 46.85 0 0 0 27.33 42.29v61a135.08 135.08 0 0 0-63.86 27.79l-169.1-130.17A52.49 52.49 0 0 0 372 309c0-29.21-23.89-52.92-53.4-53s-53.45 23.59-53.48 52.81 23.85 52.88 53.36 52.93a53.29 53.29 0 0 0 26.33-7.09l166.38 128.1a132.14 132.14 0 0 0 2.07 150.3l-50.62 50.1A43.42 43.42 0 1 0 450.1 768c24.24 0 43.9-19.46 43.9-43.45a42.24 42.24 0 0 0-2-12.42l50-49.52a135.28 135.28 0 0 0 81.8 27.47c74.61 0 135.06-59.83 135.06-133.65 0-66.82-49.62-122-114.33-131.91" fill="#fff" fill-rule="evenodd"/></svg>
								HubSpot
							</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-grey-100 px-2 py-0.5 text-[10px] font-medium text-grey-500">
								<svg class="h-2.5 w-2.5 shrink-0" viewBox="0 0 256 256"><path d="M143.37 77.73l42.07-42.07c1.73-1.73 1.73-4.53 0-6.26l-14.84-14.84c-1.73-1.73-4.53-1.73-6.26 0l-42.07 42.07c-18.12-10.53-39.2-14.08-59.6-9.98C28.43 54.03 3.6 82.8.37 117.58c-4.98 53.46 41.53 98.14 95.01 91.2 32.63-4.24 59.33-28.38 68.22-60.02 4.68-16.63 3.7-33.47-1.73-48.48L143.37 77.73zM82.08 173.58c-26.22 0-47.5-21.28-47.5-47.5s21.28-47.5 47.5-47.5 47.5 21.28 47.5 47.5-21.28 47.5-47.5 47.5z" fill="#00A1E0" transform="translate(30 22) scale(.9)"/></svg>
								Salesforce
							</span>
						</div>
					</div>
				</button>
			</div>

			<button
				class="text-grey-400 hover:text-grey-600 mt-8 text-sm underline transition-colors"
				onclick={() => { v7OnboardingDone = true; }}
			>
				Skip, take me to the dashboard
			</button>
		</div>
	</div>
</div>

{:else}
<div class="flex min-h-screen min-w-screen flex-col">
	<Navbar />
	{#if version === 'v2' || version === 'v3' || version === 'v6'}
		<SubNav />
	{/if}
	{@render children()}
</div>
{/if}
<Toast />
