<script lang="ts" generics="TData, TValue">
    import { Badge } from "$lib/components/ui/badge/index.js";
    import {
        type ColumnDef,
        getCoreRowModel,
        type Row,
    } from "@tanstack/table-core";
    import {
        createSvelteTable,
        FlexRender,
        renderComponent,
        renderSnippet,
    } from "$lib/components/ui/data-table/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import CircleCheckFilledIcon from "@tabler/icons-svelte/icons/circle-check-filled";
    import ExclamationCircleFilled from "@tabler/icons-svelte/icons/exclamation-circle-filled";
    import type { Alert } from "$lib/schema";
    import DataTableCellViewer from "./data-table-cell-viewer.svelte";

    export const columns: ColumnDef<Alert>[] = [
        {
            accessorKey: "fingerprint",
            header: "Fingerprint",
            cell: ({ row }) =>
                renderComponent(DataTableCellViewer, { item: row.original }),
            enableHiding: false,
        },
        {
            accessorKey: "labels.alertname",
            header: "Alert",
        },
        {
            accessorKey: "labels.instance",
            header: "Instance",
        },
        {
            accessorKey: "labels.severity",
            header: "Severity",
            cell: ({ row }) => renderSnippet(DataTableSeverity, { row }),
        },
        {
            accessorKey: "status.state",
            header: "Status",
            cell: ({ row }) => renderSnippet(DataTableStatus, { row }),
        },
        {
            accessorKey: "updatedAt",
            header: "Updated at",
        },
    ];

    let { data, timestamp }: { data: Alert[] } & { timestamp: string } =
        $props();

    const table = createSvelteTable({
        get data() {
            return data;
        },
        columns,
        getCoreRowModel: getCoreRowModel(),
    });
</script>

{#snippet DataTableSeverity({ row }: { row: Row<Alert> })}
    <div class="w-32">
        <Badge variant="outline" class="text-muted-foreground px-1.5">
            {row.original.labels.severity}
        </Badge>
    </div>
{/snippet}

{#snippet DataTableStatus({ row }: { row: Row<Alert> })}
    <Badge
        variant={row.original.status.state === "resolved"
            ? "outline"
            : "destructive"}
        class="px-1.5"
    >
        {#if row.original.status.state === "resolved"}
            <CircleCheckFilledIcon class="fill-green-500 dark:fill-green-400" />
        {:else}
            <ExclamationCircleFilled />
        {/if}
        <span class="pl-1">{row.original.status.state}</span>
    </Badge>
{/snippet}

<div class="rounded-md border">
    <Table.Root>
        <Table.Caption>
            Last refreshed at: {timestamp}
        </Table.Caption>
        <Table.Header class="bg-muted sticky top-0 z-10">
            {#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
                <Table.Row>
                    {#each headerGroup.headers as header (header.id)}
                        <Table.Head colspan={header.colSpan}>
                            {#if !header.isPlaceholder}
                                <FlexRender
                                    content={header.column.columnDef.header}
                                    context={header.getContext()}
                                />
                            {/if}
                        </Table.Head>
                    {/each}
                </Table.Row>
            {/each}
        </Table.Header>
        <Table.Body class="**:data-[slot=table-cell]:first:w-8">
            {#each table.getRowModel().rows as row (row.id)}
                <Table.Row data-state={row.getIsSelected() && "selected"}>
                    {#each row.getVisibleCells() as cell (cell.id)}
                        <Table.Cell>
                            <FlexRender
                                content={cell.column.columnDef.cell}
                                context={cell.getContext()}
                            />
                        </Table.Cell>
                    {/each}
                </Table.Row>
            {:else}
                <Table.Row>
                    <Table.Cell
                        colspan={columns.length}
                        class="h-24 text-center"
                    >
                        No results.
                    </Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
