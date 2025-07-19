<script lang="ts">
    import { badgeVariants } from "$lib/components/ui/badge/index.js";
    import CircleCheckFilledIcon from "@tabler/icons-svelte/icons/circle-check-filled";
    import ExclamationCircleFilled from "@tabler/icons-svelte/icons/exclamation-circle-filled";

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
        statusData: {
            cluster: {
                status: string;
                peers: { name: string; address: string }[];
            };
            config: {
                original: string;
            };
        } | null;
        refreshedAt: string;
        error?: string;
    };

    $: status = data.statusData?.cluster.status || "down";
</script>

<a
    href={data.alertmanagerUrl}
    target="_blank"
    class={badgeVariants({
        variant: status == "ready" ? "outline" : "destructive",
    })}
>
    {#if status != "ready"}
        <ExclamationCircleFilled />
    {:else}
        <CircleCheckFilledIcon class="fill-green-500 dark:fill-green-400" />
    {/if}
    <span class="pl-1">{status}</span></a
>

<p>Last refreshed at: {data.refreshedAt}</p>
