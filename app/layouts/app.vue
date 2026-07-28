<script setup>
const ui = useUiStore();
const widget = useWidgetStore();

onUpdated((el = ui.toast.type) => {
  if (!el) {
    setTimeout(() => {
      ui.toast.message = '';
    }, 2000);
  }
})

const step = useWidgetStore().workflow.current;


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
    <LayoutsPartialsHeader/>

    <!-- Main layout regions -->
    <div class="mx-auto grid max-w-[1440px] grid-cols-1 gap-0 px-0 pt-0 md:grid-cols-[80px_1fr_220px] lg:grid-cols-[100px_1fr_250px]">

      <!-- Left Workspace Navigator -->
      <LayoutsPartialsNav/>

      <!-- Main Workspace -->
      <main class="sm:w-full min-h-[calc(100vh-108px)] px-4 pb-20 pt-4 md:px-6 md:pb-4">

        <div v-if="ui.showWizedModal == false" class="mb-1">
          <UiToast />
        </div>

        <!-- slot  -->
        <slot></slot>

      </main>

      <!-- Right Context Assistant (Desktop sidebar / Mobile drawer) -->
      <LayoutsPartialsAsside/>
    </div>

    <!-- Bottom Status Bar -->
    <LayoutsPartialsFooter />

   
  </div>
</template>

<style lang="postcss" scoped>

</style>
