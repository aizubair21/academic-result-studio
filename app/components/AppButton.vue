<script lang="ts" setup>
import { ChevronRight, LoaderCircle, Plus, Minus, X, PenLine, Check, Save } from "@lucide/vue";

const ui = useUiStore()
defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'sm' },
  type: { type: String, default: 'button' },
  icon: { type: String, default: '' }
})

const variantClasses = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20',
  secondary: 'bg-emerald-500/10 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 shadow-sm shadow-emerald-500/10',
  ghost: 'hover:bg-gray-100',
  danger: 'inline-flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 transition'
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-3.5 text-lg',
}
</script>

<template>
  <button :type="type" :disabled="ui.saving"
    :class="['inline-flex items-center justify-center rounded-lg font-semibold transition duration-200', variantClasses[variant], sizeClasses[size]]">


    <!-- button slog -->
    <slot />

    <!-- Updating Spinner  -->
    <svg v-if="ui.saving" class="ml-2 animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>


    <!-- Placeholder Icon  -->
    <div v-if="!ui.saving">
      <ChevronRight v-if="icon == 'chevron'" size="17" class="ml-2" />
      <Plus v-if="icon == 'plus'" size="17" class="ml-2"/>
      <Minus v-if="icon == 'minus'" size="17" />
      <X v-if="icon == 'x'" size="17" class="ml-2"/>
      <Check v-if="icon == 'check'" size="17" class="ml-2"/>
      <LoaderCircle class="animate-spin" v-if="icon == 'spin'" size="17" />
      <PenLine v-if="icon == 'pen'" size="17" />
      <Save v-if="icon == 'save'" size="17" class="ml-2" />
    </div>  

  </button>
</template>
