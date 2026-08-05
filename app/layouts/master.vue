<script setup>
const ui = useUiStore();
const settingsOpen = ref(false);
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans">
    <!-- Top Application Bar -->
    <LayoutsPartialsHeader />


    <!-- Main layout regions -->
    <div
      class="mx-auto grid max-w-[1440px] grid-cols-1 gap-0 px-0 pt-0 md:grid-cols-[80px_1fr] lg:grid-cols-[100px_1fr]">

      <!-- Left Workspace Navigator -->
      <LayoutsPartialsNav />

      <!-- Main Workspace -->
      <main class="sm:w-full min-h-[calc(100vh-108px)] px-4 pb-20 pt-4 md:px-6 md:pb-4">

        <div v-if="ui.showWizedModal == false" class="mb-1">
          <UiToast />
        </div>

        <!-- slot  -->
        <div class="mx-auto grid grid-cols-1 md:grid-cols-[1fr]">
          <slot></slot>
        </div>

      </main>

    </div>

    <!-- Bottom Status Bar -->
    <LayoutsPartialsFooter />

    <!-- Settings Modal -->
    <AppModal title="Settings" :open="settingsOpen" @close="settingsOpen = false">
      <div class="space-y-4">
        <AppCard>
          <template #default>
            <div class="space-y-2">
              <div class="flex items-start px-2 py-1"></div>
              <div class="text-sm font-semibold text-slate-700">UI-only settings</div>
              <div class="text-sm text-slate-600">No persistence/business logic implemented.</div>
            </div>
          </template>
        </AppCard>
        <div class="flex justify-end">
          <AppButton variant="primary" size="md" @click="settingsOpen = false">Done</AppButton>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<style lang="postcss" scoped></style>
