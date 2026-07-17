<script lang="ts" setup>
const props = defineProps({
  title: { type: String, default: '' },
  actions: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="rounded-[2rem] bg-slate-950/5 p-4 shadow-sm shadow-slate-200/40">
    <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.24em] text-slate-500">Toolbar</p>
        <h2 class="mt-2 text-xl font-semibold text-slate-900">{{ title }}</h2>
      </div>
      <div class="flex flex-wrap gap-3">
        <button
          v-for="(action, index) in actions"
          :key="index"
          class="rounded-3xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          @click="action.onClick?.()"
        >
          {{ action.label }}
        </button>
      </div>
    </div>
  </div>
</template>
