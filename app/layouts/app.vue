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
    <LayoutsPartialsHeader />

    <!-- Main layout regions -->
    <div
      class="mx-auto grid max-w-[1440px] grid-cols-1 gap-0 px-0 pt-0 md:grid-cols-[80px_1fr_280px] lg:grid-cols-[100px_1fr_350px]">

      <!-- Left Workspace Navigator -->
      <LayoutsPartialsNav />

      <!-- Main Workspace -->
      <main class="sm:w-full min-h-[calc(100vh-108px)] px-4 pb-20 pt-4 md:px-6 md:pb-4">

        <div v-if="!ui.sidebarOpen" class="fixed top-0 inset-x-50 mb-1">
          <UiToast />
        </div>

        <!-- slot  -->
        <slot></slot>

      </main>

      <!-- Right Context Assistant (Desktop sidebar / Mobile drawer) -->
      <LayoutsRightAsside>
        <!-- Welcome Hero Section -->
        <div v-if="widget.workflow.current !== 'dashboard'" class="mb-6">
          <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
            <div class="flex items-start justify-between">
              <div class="space-y-3">
                <!-- <div class="text-4xl">🎯</div> -->
                <h1 class="text-3xl font-bold">স্বাগতম!</h1>
              </div>


            </div>

            <p class="text-indigo-100 max-w-xl leading-relaxed mt-3 border-t border-gray-200 pt-2">
              নিচের ধাপগুলো অনুসরণ করে আপনার প্রতিষ্ঠানের তথ্য যোগ করুন এবং রেজাল্ট ম্যানেজমেন্ট শুরু করুন।
            </p>
          </div>
        </div>


        <ArsWidgetSteps />
      </LayoutsRightAsside>

    </div>

    <!-- Bottom Status Bar -->
    <LayoutsPartialsFooter />


  </div>
</template>

<style lang="postcss" scoped></style>
