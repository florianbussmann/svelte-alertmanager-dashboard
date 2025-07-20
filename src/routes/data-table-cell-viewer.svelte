<script lang="ts">
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import type { Alert } from "$lib/schema";
    let { item }: { item: Alert } = $props();
</script>

<Dialog.Root>
    <Dialog.Trigger>
        {#snippet child({ props })}
            <Button
                variant="link"
                class="text-foreground w-fit px-0 text-left"
                {...props}
            >
                {item.fingerprint}
            </Button>
        {/snippet}</Dialog.Trigger
    >
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>{item.fingerprint}</Dialog.Title>
            <Dialog.Description>
                {item.annotations.summary}
            </Dialog.Description>
        </Dialog.Header>
        {item.annotations.description}
        <Dialog.Footer>
            <Dialog.Close>
                {#snippet child({ props })}
                    <Button variant="outline" {...props}>Done</Button>
                {/snippet}
            </Dialog.Close>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
