<script setup>
import subjectIndex from '~/pages/subjects/index.vue';

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
    <ArsSubjectsCreate v-if="widget.workflow.current == 'subjects'" />
    <ArsStudentsCreate v-if="widget.workflow.current == 'students'" />
  </div>

</div>
</template>


<style>

</style>