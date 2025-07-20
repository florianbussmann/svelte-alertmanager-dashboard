<script lang="ts">

    import DataTable from "./data-table.svelte";

    import { onMount } from "svelte";
    import { invalidate } from "$app/navigation";

    let interval: any;
    const refreshInterval =
        parseInt(import.meta.env.VITE_REFRESH_INTERVAL) || 10000;

    onMount(() => {
        interval = setInterval(() => {
            try {
                invalidate("am:status");
                console.log("Invalidated!");
            } catch (e) {
                console.error("Failed to invalidate:", e);
            }
        }, refreshInterval); // every 10s

        return () => clearInterval(interval);
    });

    export let data: {
        alerts: any[];
        refreshedAt: string;
    };
</script>

<div class="w-full items-center justify-center px-4 actions">
    <DataTable data={data.alerts} timestamp={data.refreshedAt} />
</div>
