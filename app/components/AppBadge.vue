<script lang="ts" setup>
const props = defineProps({
  variant: { type: String, default: 'indigo' },
})

const variantClasses = {
  indigo: 'bg-indigo-100 text-indigo-700',
  emerald: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-700',
  slate: 'bg-slate-100 text-slate-700',
}
</script>

<template>
  <span :class="['inline-flex rounded-full px-3 py-1 text-sm font-semibold', variantClasses[variant] || variantClasses.slate]">
    <slot />
  </span>
</template>
