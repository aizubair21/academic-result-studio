<script lang="ts" setup>
import { WorkflowResolver } from '~/service/workflowResolver'

definePageMeta({
  layout: 'master',
})

const widget = useWidgetStore();
const ui = useUiStore();
const showOpenModal = ref(false)

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
    <div v-if="widget.workflow.current == 'dashboard'" class="mb-6 md:flex items-start gap-4 justify-center">

      <div class="">      
        <ArsWidgetWelcome />
        <ArsWidgetPanel />



        <div>


        </div>
      </div>

    </div>

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

