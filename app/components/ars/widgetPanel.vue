<script setup>
const widget = useWidgetStore();
</script>


<template>
<div class="bg-white p-6 border rounded-lg">

  <!-- widget welcome -->
    <ArsWidgetSteps />

  <!-- widget box  -->
  <div class="p-6 rounded-lg bg-slate-50">
    <ArsInstituteCreate v-if="widget.workflow.current == 'institute'" />
    <ArsClassesCreate v-if="widget.workflow.current == 'classes'" />
  </div>

</div>
</template>


<style>

</style>