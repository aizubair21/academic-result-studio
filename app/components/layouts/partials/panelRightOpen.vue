<script lang="ts" setup>
const props = defineProps({
    type: { type: String, default: 'asside' },
    variant: { type: String, default: 'ghost' },
    size: { default: 'sm' },
})
import { PanelLeftOpen, Plus } from '@lucide/vue';
const ui = useUiStore();

// Sync with uiStore sidebarOpen
const sidebarOpen = computed({
    get: () => ui.sidebarOpen,
    set: (val) => { ui.sidebarOpen = val; },
});
</script>

<template>
    <AppButton class="mt-0" :variant="variant" :size="size" title="Toggle sidebar" @click="sidebarOpen = !sidebarOpen">
        <PanelLeftOpen v-if="type == 'asside'" />
        <Plus v-else />
    </AppButton>
</template>

<style lang="postcss" scoped></style>
