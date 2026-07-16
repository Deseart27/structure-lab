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
	let v7ShowOnboarding = $derived(version === 'v7' && !v7OnboardingDone);

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
		<div class="mx-4 w-full max-w-3xl text-center">
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
					<div>
						<p class="text-grey-900 text-base font-bold">Find new leads</p>
						<p class="text-grey-500 mt-1 text-sm">Search our database of 700M+ contacts by company, title, location and more.</p>
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
					<div>
						<p class="text-grey-900 text-base font-bold">Find emails & phones</p>
						<p class="text-grey-500 mt-1 text-sm">Upload a CSV or connect your CRM — we'll find verified emails and direct dials.</p>
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
					<div>
						<p class="text-grey-900 text-base font-bold">Reverse enrich my data</p>
						<p class="text-grey-500 mt-1 text-sm">Have emails already? Get full profiles — name, title, company, LinkedIn, phone.</p>
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
					<div>
						<p class="text-grey-900 text-base font-bold">Enrich my CRM</p>
						<p class="text-grey-500 mt-1 text-sm">Connect HubSpot or Salesforce and keep your contacts enriched automatically.</p>
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
