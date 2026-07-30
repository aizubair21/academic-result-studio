<!--
Index Page — Main onboarding dashboard.
Displays welcome section, step progress, and the current workflow form.
-->
<script lang="ts" setup>
import { WorkflowResolver } from '~/service/workflowResolver'

definePageMeta({
  layout: 'app',
})

const widget = useWidgetStore();
const ui = useUiStore();

// Resolve workflow on mount to determine current step
onMounted(async () => {
  const resolver = new WorkflowResolver();
  await resolver.resolve();
})

// Institute info for greeting
const institute = useInstitute();
const instituteData = ref<any>(null);

onMounted(async () => {
  if (await institute.exists()) {
    instituteData.value = await institute.first();
  }
})
</script>

<template>
  <div class="min-h-[calc(100vh-200px)]">
    

    <!-- Dashboard Hero (all completed) -->
    <div v-if="widget.workflow.current == 'dashboard'" class="mb-6">
      <div class="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
        <div class="flex items-center gap-4">
          <div class="text-5xl">🎉</div>
          <div>
            <h1 class="text-2xl font-bold">সবকিছু প্রস্তুত!</h1>
            <p class="text-emerald-100 mt-1">
              {{ instituteData?.name || 'আপনার প্রতিষ্ঠান' }} — রেজাল্ট ম্যানেজমেন্ট শুরু করতে প্রস্তুত।
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Steps Progress Indicator -->
    <!-- <ArsWidgetSteps /> -->

    <!-- Workflow Panel (Form / Dashboard) -->
    <ArsWidgetPanel />
  </div>
</template>

<style lang="postcss" scoped>
/* Smooth fade-in for the page */
.page-enter-active {
  transition: opacity 0.3s ease;
}
.page-enter-from {
  opacity: 0;
}
</style>

