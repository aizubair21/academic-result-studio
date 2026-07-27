<script lang="ts" setup>

</script>

<template>
     <header class="sticky top-0 z-40 h-[72px] border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
            
          </div>
          <div>
            <div class="text-base font-semibold text-slate-900">Academic Result Studio</div>
            <div class="text-xs font-medium text-slate-500"> ... </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            title="Settings"
            @click="settingsOpen = true"
          >
            <Settings :size="18" class="text-slate-700" />
          </button>
         
        </div>
      </div>
    </header>
</template>

<style lang="postcss" scoped>
    
</style>
