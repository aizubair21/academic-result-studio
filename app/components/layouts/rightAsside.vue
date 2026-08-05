<script setup>
const isMobile = ref(false);
const ui = useUiStore();
const widget = useWidgetStore();
const props = defineProps({
  title: { type: String, default: 'প্যানেল' },
})

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});

function checkMobile() {
  isMobile.value = window.innerWidth < 768;
}
</script>

<template>

  <!-- Mobile: Slide-over drawer from right -->
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="ui.sidebarOpen" class="fixed inset-0 z-[60]">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
          @click="ui.sidebarOpen = false"></div>
        <!-- Drawer panel -->
        <aside class="fixed right-0 top-0 bottom-0 w-[320px] max-w-[85vw] bg-white shadow-2xl overflow-y-auto z-[61]">
          <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <h2 class="text-sm font-semibold text-slate-700"> {{ title }} </h2>
            <button
              class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
              @click="ui.sidebarOpen = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-4">
            <!-- Page-specific drawer content teleported from LayoutsRightAsside -->
            <div id="mobile-drawer-content">
              <slot></slot>
            </div>
            <!-- Fallback content when no page-specific content is provided -->
            <!-- <div v-if="widget.workflow.current != 'dashboard'" class="mt-4">
                <ArsWidgetWelcome />
                <div class="mt-6">
                  <div class="text-sm font-semibold text-slate-700">Project Progress</div>
                </div>
              </div> -->
          </div>
        </aside>
      </div>
    </Transition>
  </Teleport>

  <!-- Desktop: Render normally as sidebar column -->
  <!-- <aside class="hidden self-start border-l border-slate-200 bg-white md:sticky md:top-[72px] md:block md:h-[calc(100vh-108px)]">
      <div class="flex h-full flex-col space-y-6 overflow-y-auto p-6">
        <slot></slot>
      </div>
    </aside> -->
</template>

<style>
/* Slide-over drawer transition */
.drawer-enter-active {
  transition: all 0.3s ease-out;
}

.drawer-leave-active {
  transition: all 0.2s ease-in;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from aside,
.drawer-leave-to aside {
  transform: translateX(100%);
}
</style>
