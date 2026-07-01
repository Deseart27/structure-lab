<script lang="ts">
	import { page } from '$app/stores';
	let { children } = $props();
	let version = $derived($page.params.version);
</script>

<div
	class="flex flex-col overflow-hidden"
	class:h-[calc(100vh-64px)]={version !== 'v2'}
	class:h-[calc(100vh-64px-40px)]={version === 'v2'}
>
	{@render children()}
</div>
