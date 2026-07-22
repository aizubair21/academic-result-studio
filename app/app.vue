<script lang="ts" setup>
import { WorkflowResolver } from './service/workflowResolver'

const widgetStore = useWidgetStore()

onMounted(async () => {
  const resolver = new WorkflowResolver();

  const state = await resolver.resolve();
  widgetStore.workflow.current = state.workflow;
})


</script>

<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>

<style lang="postcss" scoped>
  
</style>
