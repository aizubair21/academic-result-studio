<script lang="ts" setup>
const widget = useWidgetStore();
const ui = useUiStore();
</script>

<template>
    <!-- Desktop: Right sidebar (visible on md+) -->
    <aside class="hidden border-l border-slate-200 bg-white md:block">
        <div class="flex h-[calc(100vh-108px)] flex-col">
          <div class="p-4">

            <div>

              <!-- Default content when slot is not used -->
              <div v-if="widget.workflow.current != 'dashboard'">
                <!-- workflow welcome and workflow steps  -->
                <ArsWidgetWelcome />
                <div class="mt-6">
                  <div class="text-sm font-semibold text-slate-700">Project Progress</div>
                </div>
              </div>

            </div>
            
          </div>
        </div>
    </aside>

    <!-- Mobile: Slide-over drawer from right -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="ui.sidebarOpen" class="fixed inset-0 z-[60] md:hidden">
          <!-- Backdrop -->
          <div
            class="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            @click="ui.sidebarOpen = false"
          ></div>
          <!-- Drawer panel -->
          <aside class="fixed right-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-white shadow-2xl overflow-y-auto z-[61]">
            <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h2 class="text-sm font-semibold text-slate-700">প্যানেল</h2>
              <button
                class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition"
                @click="ui.sidebarOpen = false"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-4">
              <!-- Page-specific drawer content teleported from LayoutsRightAsside -->
              <div id="mobile-drawer-content"></div>
              <!-- Fallback content when no page-specific content is provided -->
              <div v-if="widget.workflow.current != 'dashboard'" class="mt-4">
                <ArsWidgetWelcome />
                <div class="mt-6">
                  <div class="text-sm font-semibold text-slate-700">Project Progress</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Transition>
    </Teleport>
</template>

<style >
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
