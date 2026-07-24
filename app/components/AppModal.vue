<script lang="ts" setup>
const ui = useUiStore();
const props = defineProps({
  title: { type: String, default: 'Modal Title' },
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
    <div class="w-full max-w-2xl rounded-lg bg-white p-6 shadow-2xl shadow-slate-900/20">
      <div class="mb-6 flex items-center justify-between gap-4">
        <div>
          <!-- <p class="text-sm uppercase tracking-[0.24em] text-slate-500">Modal</p> -->
          <h3 class="text-2xl font-semibold text-slate-900">{{ title }}</h3>
        </div>
        <button @click="emit('close')" class="rounded-full bg-slate-100 px-4 py-2 text-slate-700 transition hover:bg-slate-200">Close</button>
      </div>
      <div class="space-y-4">
        <div v-if="ui.showWizedModal" class="mb-1" >

          <!-- Error Alert -->
          <div v-if="ui.toast.type == 'error'" class=" text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ ui.toast.message }}
          </div>
          
          <!-- Success Alert -->
          <div v-if="ui.toast.type == 'success'" class=" text-green-700 px-4 py-3 rounded-lg text-sm">
            {{ ui.toast.message }}
          </div>

        </div>
        <slot />
      </div>
    </div>
  </div>
</template>
