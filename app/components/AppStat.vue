<script lang="ts" setup>
const props = defineProps({
  label: { type: String, default: '' },
  value: { type: [String, Number], default: '' },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="rounded-[2rem] bg-white p-6 shadow-lg shadow-slate-200/70">
    <p class="text-xs uppercase tracking-[0.24em] text-slate-500">{{ label }}</p>
    <p class="mt-4 text-4xl font-semibold text-slate-900">{{ value }}</p>
    <p v-if="description" class="mt-3 text-sm text-slate-500">{{ description }}</p>
  </div>
</template>
