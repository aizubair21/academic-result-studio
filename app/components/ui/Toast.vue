<script lang="ts" setup>
import {BellRing, Check} from "@lucide/vue";
const ui = useUiStore();
</script>

<template >
    <!-- Error Alert -->	
    <transition v-if="ui.toast.type == 'error'" name="fade">
      <div class="ctoast flex items-center gap-3 bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">
        <BellRing size="17" />  {{ ui.toast.message }}
      </div>
    </transition>
    
    <!-- Success Alert -->
    <transition v-if="ui.toast.type == 'success'" name="fade">
      <div class="ctoast flex items-center gap-3 bg-green-100 text-green-700 px-4 py-3 rounded-lg text-sm">
       <Check size="17" /> {{ ui.toast.message }}
      </div>
    </transition>
    <!-- toast message end  -->
</template>

<style lang="postcss" scoped>
    .ctoast {
      position: fixed; 
      top: 10px; 
      right: 10px; 
      z-index: 999;
    }
</style>
