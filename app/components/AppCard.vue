<script lang="ts" setup>
const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>


<template>
  <div class="rounded-lg border bg-white">
    <div v-if="title || subtitle" class="mb-4 space-y-1 p-5">
      <p v-if="subtitle" class="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{{ subtitle }}</p>
      <h3 v-if="title" class="text-2xl font-semibold text-slate-900">{{ title }}</h3>
    </div>

    <div v-if="$slots.header" class="flex items-center justify-between p-5 border-b" >
      <slot name="header"></slot>
    </div>

    <div class="p-5">
      <slot></slot>
    </div>

    <div v-if="$slots.footer" class="p-5" >
      <slot name="footer"></slot>
    </div>
  </div>
</template>


<style lang="css">

</style>
