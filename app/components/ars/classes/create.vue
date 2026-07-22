<script setup >
const uiStore = useUiStore();
const widgetStore = useWidgetStore();
const form = ref({
  name: '',
});const errors = computed({})

</script>


<template>
	<form v-if="widgetStore.workflow.current == 'classes'">
		<label class="block text-sm font-medium text-gray-700 mb-1.5">
      ক্লাসের নাম <span class="text-red-500">*</span>
    </label>
    <input
      v-model="form.name"
      type="text"
      required
      placeholder="যেমন: নবম"
      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      
    />
	</form>
</template>

<style>
</style>
