<script lang="ts">
    import { badgeVariants } from "$lib/components/ui/badge/index.js";
    import CircleCheckFilledIcon from "@tabler/icons-svelte/icons/circle-check-filled";
    import ExclamationCircleFilled from "@tabler/icons-svelte/icons/exclamation-circle-filled";

    export let data: {
        alertmanagerUrl: string;
        clusterStatus: string;
    };
</script>

<header
    class="flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear h-[calc(var(--spacing)_*_12)]"
>
    <div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <h1 class="text-base font-medium">Alertmanager Dashboard</h1>
        <div class="ml-auto flex items-center gap-2">
            <a
                href={data.alertmanagerUrl}
                target="_blank"
                class={badgeVariants({
                    variant:
                        data.clusterStatus == "ready"
                            ? "outline"
                            : "destructive",
                })}
            >
                {#if data.clusterStatus != "ready"}
                    <ExclamationCircleFilled />
                {:else}
                    <CircleCheckFilledIcon
                        class="fill-green-500 dark:fill-green-400"
                    />
                {/if}
                <span class="pl-1">{data.clusterStatus}</span></a
            >
        </div>
    </div>
</header>
