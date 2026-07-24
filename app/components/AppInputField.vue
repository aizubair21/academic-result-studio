<script lang="ts" setup>
const props = defineProps({
  label: { type: String, default: '' },
  type: { type: String, default: 'text' },
  modelValue: { type: [String, Number], default: '' },
  placeholder: { type: String, default: '' },
  req: {type: Boolean, default: false}
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1.5">{{ label }}</label>
    <input
      :required="req"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="event => emit('update:modelValue', event.target.value)"
      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
    />
  </div>
</template>
