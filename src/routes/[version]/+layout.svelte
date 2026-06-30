<script lang="ts">
	import { page } from '$app/stores';
	let { children } = $props();
	let version = $derived($page.params.version);
</script>

{@render children()}
