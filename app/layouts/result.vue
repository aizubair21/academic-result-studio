<script lang="ts" setup>
const ui = useUiStore();
const widget = useWidgetStore();

onUpdated((el = ui.toast.type) => {
  if (!el) {
    setTimeout(() => {
      ui.toast.message = '';
    }, 2000);
  }
})

const settingsOpen = ref(false);

const step = useWidgetStore().workflow.current;

const navItems = [
  { key: 'institute', label: 'প্রতিষ্ঠান', icon: '🏫' },
  { key: 'classes', label: 'ক্লাস', icon: '📚'},
  { key: 'subjects', label: 'বিষয়', icon: '📚' },
  { key: 'students', label: 'শিক্ষার্থী', icon: '👨‍🎓' },
  { key: 'mark', label: 'মার্ক', icon: '📝' },
  { key: 'reports', label: 'রিপোর্ট', icon: '📄' },
];


const readiness = computed(() => {
  return {
    institutionReady: ['institute', 'classes', 'subjects', 'students', 'marks', 'reports'].includes(step),
    classReady: ['classes', 'subjects', 'students', 'marks', 'reports'].includes(step),
    subjectsReady: ['subjects', 'students', 'marks', 'reports'].includes(step),
    studentsReady: ['students', 'marks', 'reports'].includes(step),
    marksReady: ['marks', 'reports'].includes(step),
    reportsReady: ['reports'].includes(step),
  }
});

</script>

<template>
    <div class="min-h-screen bg-slate-50 text-slate-900 font-sans">
    <!-- Top Application Bar -->
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

    <!-- Main layout regions -->
    <div class="mx-auto grid max-w-[1440px] grid-cols-[100px_1fr] gap-0 px-0 pt-0">

          <!-- Left Workspace Navigator -->
      <nav class="border-r border-slate-200 md:block" aria-label="Workspace navigation">
        <div class="flex h-[calc(100vh)] flex-col items-center gap-3 p-4">
          <NuxtLink 
            v-for="item in navItems"
            :key="item.key"
            :to="item.key"
            class="w-full text-center p-3 rounded-lg cursor-pointer border-b"
            :title="item.label"
          >
            <span class="text-lg mb-1"> {{ item.icon }}</span>
            <div>
              {{ item.label }}
            </div>
            <!-- <span
              class="pointer-events-none absolute left-[82px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block"
            >
              {{ item.label}}
            </span> -->
          </NuxtLink>
        </div>
      </nav>

      <!-- Main Workspace -->
      <main class="sm:w-full min-h-[calc(100vh-108px)] px-4 pb-4 pt-4 md:px-6">

         <div v-if="ui.showWizedModal == false" class="mb-1" >
            <UiToast />
          </div>

        <!-- slot  -->
         <div class="mx-auto grid grid-cols-[1fr_250px]">
            <slot></slot>
        </div>
        
      </main>

    </div>

    <!-- Bottom Status Bar -->
    <footer class="sticky bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex h-[36px] max-w-[1440px] items-center justify-between px-4 text-xs font-semibold text-slate-600">
       
        <div> Build With @heart </div>
        
      </div>
    </footer>

    <!-- Settings Modal -->
    <AppModal title="Settings" :open="settingsOpen" @close="settingsOpen = false">
      <div class="space-y-4">
        <AppCard>
          <template #default>
            <div class="space-y-2">
              <div class="flex items-start px-2 py-1"></div>
              <div class="text-sm font-semibold text-slate-700">UI-only settings</div>
              <div class="text-sm text-slate-600">No persistence/business logic implemented.</div>
            </div>
          </template>
        </AppCard>
        <div class="flex justify-end">
          <AppButton variant="primary" size="md" @click="settingsOpen = false">Done</AppButton>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style lang="postcss" scoped>
.router-link-active{
  background-color: #rgb(79, 70, 229);
}
</style>
