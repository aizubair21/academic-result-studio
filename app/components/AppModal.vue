<script lang="ts" setup>
const ui = useUiStore();
const props = defineProps({
  title: { type: String, default: 'Modal Title' },
  open: { type: Boolean, default: false },
})

import { CircleX } from '@lucide/vue';

const emit = defineEmits(['close'])
</script>

<template>
  <transition name="drawer">
    <div v-if="open" class="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-950/20 md:p-4 backdrop-blur-sm ">

      <div class="w-full max-w-2xl md:rounded-lg bg-white shadow-2xl shadow-slate-900/20">
        <div class="flex items-center justify-between gap-4 px-6 py-3 border-b ">
          <div>
            <!-- <p class="text-sm uppercase tracking-[0.24em] text-slate-500">Modal</p> -->
            <h3 class="text-xl font-semibold text-slate-900">{{ title }}</h3>
          </div>
          <AppButton @click="emit('close')" type="button" variant="ghost" icon="x" />
        </div>
        <div class="space-y-4 p-6">

          <div v-if="ui.showWizedModal" class="mb-1">
            <UiToast />
          </div>

          <div class="overflow-y-scroll s-modal">
            <slot> </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>


<style>
.s-modal {
  height: 100%;
  max-height: 500px !important;
}
</style>
