<script setup>
const widget = useWidgetStore();

const navItems = [
  { key: 'institute', label: 'প্রতিষ্ঠান', icon: '🏫' },
  { key: 'classes', label: 'ক্লাস', icon: '📚'},
  { key: 'subjects', label: 'বিষয়', icon: '📖' },
  { key: 'students', label: 'শিক্ষার্থী', icon: '👨‍🎓' },
  { key: 'mark', label: 'মার্ক', icon: '📝' },
  { key: 'result', label: 'রেজাল্ট', icon: '📄' },
];

</script>

<template>
    <!-- Desktop: Left sidebar navigation -->
    <nav class="hidden self-start border-r border-slate-200 md:sticky md:top-[72px] md:flex md:h-[calc(100vh-108px)] md:flex-col" aria-label="Workspace navigation">
        <div class="flex h-full flex-col items-center gap-3 p-4">
          <NuxtLink 
            v-for="item in navItems"
            :key="item.key"
            :to="item.key"
            class="w-full text-center p-3 rounded-lg cursor-pointer border-b"
            :title="item.label"
          >
            <span class="text-lg mb-2"> {{ item.icon }}</span>
            <div>
              {{ item.label }}
            </div>
          </NuxtLink>
        </div>
    </nav>

    <!-- Mobile: Fixed bottom tab navigation -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden" aria-label="Mobile navigation">
        <div class="flex items-center justify-around px-1 py-1">
          <NuxtLink 
            v-for="item in navItems"
            :key="item.key"
            :to="item.key"
            class="flex flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium text-slate-500 transition-all duration-150 min-w-0 flex-1"
            :title="item.label"
          >
            <span class="text-lg leading-none"> {{ item.icon }}</span>
            <span class="truncate w-full text-center">{{ item.label }}</span>
          </NuxtLink>
        </div>
    </nav>
</template>

<style lang="postcss" scoped>
/* Desktop active state */
.router-link-active{
  background-color: rgb(79, 70, 229);
  color:white;
  font-weight:500;
}

/* Mobile active state */
@media (max-width: 767px) {
  nav:not(.hidden) .router-link-active {
    color: rgb(79, 70, 229);
    background-color: rgba(79, 70, 229, 0.08);
    font-weight: 600;
  }
}
</style>
