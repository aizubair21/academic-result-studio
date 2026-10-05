<script lang="ts" setup>
const props = defineProps({
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
})
</script>


<template>
  <div class="md:bg-white md:rounded-lg">
    <div v-if="title || subtitle" class="mb-4 space-y-1 py-5 px-2 lg:px-5">
      <p v-if="subtitle" class="text-sm font-medium uppercase tracking-[0.24em] text-slate-500">{{ subtitle }}</p>
      <h3 v-if="title" class="text-2xl font-semibold text-slate-900">{{ title }}</h3>
    </div>

    <div v-if="$slots.header" class="flex items-center justify-between py-5 px-2 lg:px-5 border-b  backdrop-blur">
      <slot name="header"></slot>
    </div>

    <div class="py-5 px-2 lg:px-5">
      <slot></slot>
    </div>

    <div v-if="$slots.footer" class="py-5 px-2 lg:px-5">
      <slot name="footer"></slot>
    </div>
  </div>
</template>


<style lang="css"></style>
