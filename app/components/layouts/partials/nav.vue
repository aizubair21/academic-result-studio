<script setup>

const navItems = [
  { key: 'institute', label: 'প্রতিষ্ঠান', icon: '🏫' },
  { key: 'classes', label: 'ক্লাস', icon: '📚'},
  { key: 'subjects', label: 'বিষয়', icon: '📚' },
  { key: 'students', label: 'শিক্ষার্থী', icon: '👨‍🎓' },
  { key: 'mark', label: 'মার্ক', icon: '📝' },
  { key: 'reports', label: 'রেজাল্ট', icon: '📄' },
];

</script>

<template>
    <nav class="border-r border-slate-200 md:block" aria-label="Workspace navigation">
        <div class="flex h-[calc(100vh)] flex-col items-center gap-3 p-4">
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
            <!-- <span
              class="pointer-events-none absolute left-[82px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block"
            >
              {{ item.label}}
            </span> -->
          </NuxtLink>
        </div>
    </nav>
</template>

<style lang="postcss" scoped>
.router-link-active{
  background-color: rgb(79, 70, 229);
  color:white;
  font-weight:500;
}
</style>
