<script lang="ts" setup>
const ui = useUiStore();

const props = defineProps({
    label: { type: String, default: '' },
    isRequired: { type: Boolean, default: false },
    placeholder: { type: String, default: 'একটি বিকল্প বেছে নিন' },

})
</script>

<template>
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1.5"> {{ label }} <span v-if="isRequired"
            class="text-red-500">*</span></label>
    <select v-model="ui.selectedClassId" required
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
        <option :value="null" disabled> {{ placeholder }} </option>
        <slot></slot>
    </select>
</template>

<style lang="postcss" scoped></style>
