<script lang="ts" setup>
const props = defineProps({
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: '' },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="block space-y-2 text-slate-700">
    <span class="text-sm font-medium text-slate-600">{{ label }}</span>
    <input
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="event => emit('update:modelValue', event.target.value)"
      class="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
    />
  </label>
</template>
