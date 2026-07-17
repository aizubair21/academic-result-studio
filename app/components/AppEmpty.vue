<script lang="ts" setup>
const props = defineProps({
  title: { type: String, default: 'No Content Available' },
  description: { type: String, default: 'কোনো ডেটা পাওয়া যায়নি। দয়া করে পরে আবার চেষ্টা করুন।' },
})
</script>

<template>
  <div class="rounded-[2rem] border border-dashed border-slate-300 bg-slate-50 px-8 py-12 text-center text-slate-600 shadow-sm">
    <div class="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">📭</div>
    <h3 class="text-xl font-semibold text-slate-900">{{ title }}</h3>
    <p class="mt-2 text-sm leading-6">{{ description }}</p>
  </div>
</template>
