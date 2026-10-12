<script lang="ts" setup>
import { WorkflowResolver } from './service/workflowResolver'


onMounted(async () => {
  const resolver = new WorkflowResolver();
  await resolver.resolve();




  const buttons = document.getElementsByTagName('button');
  // const uid = 'abc';
  // for (var i = 0; i = buttons.length - 1; i++) {
  //   buttons[i].addEventListener('click', (e) => {
  //     console.log(e);
  //   })
  // }

})



</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="postcss" scoped>
  
</style>
