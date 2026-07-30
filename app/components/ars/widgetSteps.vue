<!--
Widget Steps — Visual step progress indicator for the onboarding workflow.
Shows all steps with icons, labels, and completion status.
-->
<script setup>
	const widgetStore = useWidgetStore();
</script>

<template>
	<div v-if="widgetStore.workflow.current !== 'dashboard'" class="mb-8">
		<!-- Step Progress Bar -->
		<div class="flex flex-col items-center justify-center mb-2 overflow-x-auto px-2">
			<div
				v-for="(step, index) in widgetStore.widgetSteps"
				:key="step.widget"
				class="flex items-center flex-shrink-0 mb-4 w-full border-b pb-3"
			>
				<!-- Step Indicator -->
				<div class="flex items-center w-full justify-between">
					<span
						class="mt-1.5 text-text-md font-medium whitespace-nowrap transition-colors duration-200"
						:class="{
							'text-emerald-600': widgetStore.workflow.completed[step.widget],
							'text-indigo-600': widgetStore.workflow.current === step.widget && !widgetStore.workflow.completed[step.widget],
							'text-slate-400': widgetStore.workflow.current !== step.widget && !widgetStore.workflow.completed[step.widget],
						}"
					>
						{{ step.name }}
					</span>
					<div
						class="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 cursor-pointer"
						:class="{
							'bg-emerald-500 text-white shadow-md shadow-emerald-200': widgetStore.workflow.completed[step.widget],
							'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-4 ring-indigo-100': widgetStore.workflow.current === step.widget && !widgetStore.workflow.completed[step.widget],
							'bg-slate-200 text-slate-400': widgetStore.workflow.current !== step.widget && !widgetStore.workflow.completed[step.widget],
							'hover:bg-slate-300': widgetStore.isStepAccessible(step.widget) && widgetStore.workflow.current !== step.widget && !widgetStore.workflow.completed[step.widget],
						}"
						:title="step.description"
						@click="widgetStore.goToStep(step.widget)"
					>
						<span v-if="widgetStore.workflow.completed[step.widget]">✓</span>
						<span v-else>{{ step.icon }}</span>
					</div>
					
				</div>

				<!-- Connector line between steps (except last) -->
				<!-- <div v-if="index < widgetStore.widgetSteps.length - 1" class="mx-2 w-8 md:w-12 lg:w-16">
					<div
						class="h-0.5 rounded-full transition-all duration-500"
						:class="{
							'bg-emerald-400': widgetStore.workflow.completed[step.widget],
							'bg-slate-200': !widgetStore.workflow.completed[step.widget],
						}"
					></div>
				</div> -->
			</div>
		</div>

		<!-- Progress Text -->
		<!-- Progress Circle -->
		 <div>
			<div class="hidden sm:flex flex-col items-center">
				<div class="relative w-20 h-20">
					<svg class="w-20 h-20 transform -rotate-90" viewBox="0 0 72 72">
					 <!-- Background circle -->
					 <circle
						 cx="36" cy="36" r="30"
						 fill="none"
						 stroke="gray"
						 stroke-width="5"
					 />
					 <!-- Progress circle -->
					 <circle
						 cx="36" cy="36" r="30"
						 fill="none"
						 stroke="rgb(147, 51, 234)"
						 stroke-width="5"
						 stroke-linecap="round"
						 :stroke-dasharray="188.5"
						 :stroke-dashoffset="188.5 - (188.5 * widgetStore.progressPercent / 100)"
						 class="transition-all duration-700 ease-out"
					 />
					 </svg>
					 <div class="absolute inset-0 flex items-center justify-center">
						<span class="text-lg font-bold">{{ widgetStore.progressPercent }}%</span>
					</div>
			 	</div>
			</div>
		 </div>
		<div class="mt-2 text-center text-sm text-slate-500">
			অগ্রগতি: <span class="font-semibold text-slate-700">{{ widgetStore.completedStepCount }}</span> / {{ widgetStore.stepCount }} সম্পন্ন
			({{ widgetStore.progressPercent }}%)
		</div>
	</div>
</template>

<style scoped>
/* Smooth transitions for step changes */
.v-enter-active,
.v-leave-active {
	transition: opacity 0.3s ease;
}
.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>

