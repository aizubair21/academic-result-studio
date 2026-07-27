<script lang="ts" setup>
const widget = useWidgetStore();
</script>

<template>
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
</template>

<style lang="postcss" scoped>
    
</style>
