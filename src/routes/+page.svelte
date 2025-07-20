<script lang="ts">
    import { badgeVariants } from "$lib/components/ui/badge/index.js";
    import CircleCheckFilledIcon from "@tabler/icons-svelte/icons/circle-check-filled";
    import ExclamationCircleFilled from "@tabler/icons-svelte/icons/exclamation-circle-filled";

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
        alertmanagerUrl: string;
        clusterStatus: string;
        statusData: {
            cluster: {
                status: string;
                peers: { name: string; address: string }[];
            };
            config: {
                original: string;
            };
        } | null;
        alerts: any[];
        refreshedAt: string;
        error?: string;
    };
</script>

<a
    href={data.alertmanagerUrl}
    target="_blank"
    class={badgeVariants({
        variant: data.clusterStatus == "ready" ? "outline" : "destructive",
    })}
>
    {#if data.clusterStatus != "ready"}
        <ExclamationCircleFilled />
    {:else}
        <CircleCheckFilledIcon class="fill-green-500 dark:fill-green-400" />
    {/if}
    <span class="pl-1">{data.clusterStatus}</span></a
>

{console.log(data.alerts)}

<div class="w-full items-center justify-center px-4 actions">
    <DataTable data={data.alerts} timestamp={data.refreshedAt} />
</div>
