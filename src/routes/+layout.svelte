<script lang="ts">
    import SiteHeader from "$lib/components/site-header.svelte";
	import "../app.css";

	let { data, children } = $props();
</script>

<SiteHeader data={data} />
<div class="flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
			{@render children()}
		</div>
	</div>
</div>
