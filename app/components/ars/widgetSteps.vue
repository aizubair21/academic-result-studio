<script setup>
	const widgetStore = useWidgetStore();
	const uiStore = useUiStore();
</script>

<template>
	<div v-if="widgetStore.workflow.current != 'dashboard'" class="flex items-center space-x-2 mb-6 border-b ">
		<div v-for="us in widgetStore.widgetSteps" class="px-2 py-2 text-sm" :class="{'border-b border-indigo-900 text-indigo-900 font-bold bg-indigo-50' : widgetStore.workflow.current == us.widget}"> {{us['name']}} </div>
	</div>
</template>


<style>
	
</style>