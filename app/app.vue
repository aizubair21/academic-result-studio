<script lang="ts" setup>
import { WorkflowResolver } from './service/workflowResolver'
onMounted(async () => {
  const resolver = new WorkflowResolver();
  await resolver.resolve();
})


</script>

<template>
  <NuxtLayout>
    <NuxtRouteAnnouncer/>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>

<style lang="postcss" scoped>
  
</style>
