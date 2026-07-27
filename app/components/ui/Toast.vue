<script lang="ts" setup>
const ui = useUiStore();
</script>

<template>
    <!-- Error Alert -->
    <transition name="fade">
      <div v-if="ui.toast.type == 'error'" class=" text-red-700 px-4 py-3 rounded-lg text-sm">
        {{ ui.toast.message }}
      </div>
    </transition>
    
    <!-- Success Alert -->
    <transition name="fade">
      <div v-if="ui.toast.type == 'success'" class=" text-green-700 px-4 py-3 rounded-lg text-sm">
        {{ ui.toast.message }}
      </div>
    </transition>
    <!-- toast message end  -->
</template>

<style lang="postcss" scoped>
    
</style>
