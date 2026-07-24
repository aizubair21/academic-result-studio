<script lang="ts" setup>
const ui = useUiStore()
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  type: { type: String, default: 'button' }
})

const variantClasses = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20',
  secondary: 'bg-emerald-500/10 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-sm shadow-emerald-500/10',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-3.5 text-lg',
}
</script>

<template>
  <button :type="type" :class="['mt-4 inline-flex items-center justify-center rounded-lg font-semibold transition duration-200', variantClasses[variant], sizeClasses[size]]">

    <div v-if="ui.saving">
      সেইভ হচ্ছে ..
    </div>
    
    <slot />

  </button>
</template>
