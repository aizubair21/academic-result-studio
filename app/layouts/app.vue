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
  { key: 'institution', label: '🏫 Institution', icon: '🏫' },
  { key: 'classes', label: ' 📚 Classes', icon: '📚'},
  { key: 'subjects', label: '📚 Subjects', icon: '📚' },
  { key: 'students', label: '👨‍🎓 Students', icon: '👨‍🎓' },
  { key: 'marks', label: '📝 Marks', icon: '📝' },
  { key: 'reports', label: '📄 Reports', icon: '📄' },
  { key: 'settings', label: '⚙ Settings', icon: '⚙️' },
];

const activeNavKey = computed(() => {
  switch (widget.workflow.current) {
    case 'empty':
      return 'institution'
    case 'institution':
      return 'institution'
    case 'classes':
      return 'classes'
    case 'subjects':
      return 'subjects'
    case 'students':
      return 'students'
    case 'marks':
      return 'marks'
    case 'reports':
      return 'reports'
  }
});

const canNavigateTo = (key) => {
  if (key === 'institution') return true
  if (key === 'classes') return readiness.value.classReady
  if (key === 'subjects') return readiness.value.institutionReady
  if (key === 'students') return readiness.value.subjectsReady
  if (key === 'marks') return readiness.value.studentsReady
  if (key === 'reports') return readiness.value.marksReady
  if (key === 'settings') return true
  return false
};


const readiness = computed(() => {
  return {
    institutionReady: ['institution', 'classes', 'subjects', 'students', 'marks', 'reports'].includes(step),
    classReady: ['classes', 'subjects', 'students', 'marks', 'reports'].includes(step),
    subjectsReady: ['subjects', 'students', 'marks', 'reports'].includes(step),
    studentsReady: ['students', 'marks', 'reports'].includes(step),
    marksReady: ['marks', 'reports'].includes(step),
    reportsReady: ['reports'].includes(step),
  }
});

const navigate = (key) => {
  if (!canNavigateTo(key)) return
  switch (key) {
    case 'institution':
      widget.workflow.current = readiness.value.institutionReady ? 'institution' : 'empty'
      break
    case 'classes':
      widget.workflow.current = 'classes'
      break
    case 'subjects':
      widget.workflow.current = 'subjects'
      break
    case 'students':
      widget.workflow.current = 'students'
      break
    case 'marks':
      widget.workflow.current = 'marks'
      break
    case 'reports':
      widget.workflow.current = 'reports'
      break
    case 'settings':
      settingsOpen.value = true
      break
  }
}


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
          <!-- <button
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl transition hover:bg-slate-100"
            title="Undo"
            aria-label="Undo"
            @click="() => {}"
          >
            <Undo :size="18" class="text-slate-700" />
          </button>
          <button
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl transition hover:bg-slate-100"
            title="Redo"
            aria-label="Redo"
            @click="() => {}"
          >
            <Redo2 :size="18" class="text-slate-700" />
          </button>

          <div class="h-10 w-px bg-slate-200" /> -->

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
    <div class="mx-auto grid max-w-[1440px] grid-cols-[72px_1fr_250px] gap-0 px-0 pt-0">

          <!-- Left Workspace Navigator -->
      <nav class="border-r border-slate-200 md:block" aria-label="Workspace navigation">
        <div class="flex h-[calc(100vh-108px)] flex-col items-center gap-3 py-4">
          <button
            v-for="item in navItems"
            :key="item.key"
            class="relative flex h-12 w-12 items-center justify-center rounded-2xl transition"
            :class="{
              'bg-indigo-600 text-white shadow-sm': item.key === activeNavKey && canNavigateTo(item.key),
              'text-slate-700 hover:bg-slate-100': item.key !== activeNavKey,
              'opacity-40 cursor-not-allowed hover:bg-transparent': !canNavigateTo(item.key),
            }"
            :disabled="!canNavigateTo(item.key)"
            @click="navigate(item.key)"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <span
              class="pointer-events-none absolute left-[82px] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block"
            >
              {{ item.label.replace(/^[^\w]+\s*/, '') }}
            </span>
          </button>
        </div>
      </nav>

      <!-- Main Workspace -->
      <main class="sm:w-full min-h-[calc(100vh-108px)] px-4 pb-4 pt-4 md:px-6">

        <!-- toast messages start  -->
        <div v-if="ui.showWizedModal == false" class="mb-1" >

          <!-- Error Alert -->
          <transition name="fade">
            <div v-if="ui.toast.type == 'error'" class=" text-red-700 px-4 py-3 rounded-lg text-sm">
              {{ ui.toast.message }}
            </div>
          </transition>
          
          <!-- Success Alert -->
          <transition name="fade">
            <div v-if="ui.toast.type == 'success'" class=" text-green-700 px-4 py-3 rounded-lg text-sm">
              {{ ui.toast.message }}
            </div>
          </transition>

        </div>
        <!-- toast message end  -->

        <!-- slot  -->
        <slot></slot>
        
      </main>

      <!-- Right Context Assistant -->
      <aside class="hidden border-l border-slate-200 bg-white md:block">
        <div class="flex h-[calc(100vh-108px)] flex-col">
          <div class="p-4">
            <div class="">
              
              <ArsWidgetWelcome />
            
              <div class="mt-6">
                <div class="text-sm font-semibold text-slate-700">Project Progress</div>
                <!-- <div class="mt-3 space-y-2">
                  <div v-for="p in rightAssistant.progress" :key="p.label" class="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                    <div class="text-sm font-semibold text-slate-700">{{ p.label }}</div>
                    <div
                      class="text-xs font-bold"
                      :class="p.done ? 'text-emerald-700' : 'text-slate-400'"
                    >
                      {{ p.done ? '✓' : '○' }}
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </aside>
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
    
</style>
