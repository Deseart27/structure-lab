<script lang="ts">
	import { toast } from '$lib/toast.svelte';
</script>

{#if toast.message}
	<div class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-fade-in">
		<div class="flex items-center gap-2 rounded-xl bg-grey-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg">
			<span class="material-icons-round text-base text-emerald-400">check_circle</span>
			{toast.message}
		</div>
	</div>
{/if}

<style>
	@keyframes fade-in {
		from { opacity: 0; transform: translate(-50%, 8px); }
		to { opacity: 1; transform: translate(-50%, 0); }
	}
	.animate-fade-in {
		animation: fade-in 0.2s ease-out;
	}
</style>
