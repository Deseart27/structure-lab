<script lang="ts">
	let { children } = $props();
</script>

<div class="flex h-[calc(100vh-64px)] flex-col overflow-hidden">
	{@render children()}
</div>
