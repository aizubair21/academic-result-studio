<script lang="ts" setup>
const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <div class="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_30px_60px_-45px_rgba(15,23,42,0.35)]">
    <div v-if="title || subtitle" class="mb-4 space-y-1">
      <p v-if="subtitle" class="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{{ subtitle }}</p>
      <h3 v-if="title" class="text-2xl font-semibold text-slate-900">{{ title }}</h3>
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
