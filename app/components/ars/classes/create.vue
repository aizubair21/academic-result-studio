<script setup >
const uiStore = useUiStore();
const widgetStore = useWidgetStore();

</script>


<template>
	<form>
		<label class="block text-sm font-medium text-gray-700 mb-1.5">
            প্রতিষ্ঠানের নাম <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="যেমন: মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            :class="{ 'border-red-500': errors.name }"
          />
	</form>
</template>

<style>
</style>
