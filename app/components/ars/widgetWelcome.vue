
<script setup>
import { ChevronRight } from "@lucide/vue";


const widget = useWidgetStore();
const ui = useUiStore();


const totalClasses = ref();
const totalStudents = ref();
const totalSubjects = ref();


onMounted(async () => {
  totalClasses.value = await useClasses().count();
  totalStudents.value = await useStudents().count();
  totalSubjects.value = await useSubjects().count();
})
</script>


<template>
  <div class="flex flex-col gap-3 mb-6">
  <!-- Dashboard View (all steps completed) -->
    <div v-if="widget.workflow.current === 'dashboard'" class="space-y-6">
      <!-- Dashboard Header -->
      <div class="text-center py-8">
        <div class="text-5xl mb-4">🎉</div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">সবকিছু প্রস্তুত!</h1>
        <p class="text-slate-500 text-md">আপনার প্রতিষ্ঠানের ড্যাশবোর্ডে স্বাগতম। এখন আপনি রেজাল্ট ম্যানেজমেন্ট শুরু
          করতে প্রস্তুত।</p>
      </div>

      <!-- Quick Stats -->
      <div class="flex justify-evenly rounded-xl border border-slate-200">
        
        <NuxtLink to="classes" class="p-5 md:flex gap-2 md:items-center">
          <Layers :size="17" />
          <div class="text-lg font-bold text-slate-900"> {{ totalClasses }} টি </div>
          <div class="text-sm font-medium text-slate-500">ক্লাস</div>
        </NuxtLink>
        <NuxtLink to="subjects" class="p-5 md:flex gap-2 md:items-center">
          <BookMarked :size="17" />
          <div class="text-lg font-bold text-slate-900"> {{ totalSubjects }} টি </div>
          <div class="text-sm font-medium text-slate-500">বিষয়</div>
        </NuxtLink>
        <NuxtLink to="students" class="p-5 md:flex gap-2 md:items-center">
          <Users :size="17" />
          <div class="text-lg font-bold text-slate-900"> {{totalStudents}}  জন</div>
          <div class="text-sm font-medium text-slate-500">শিক্ষার্থী</div>
        </NuxtLink>
      </div>

      <!-- Navigation Links -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hidden">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">দ্রুত নেভিগেশন</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NuxtLink to="/institute"
            class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors group">
            <Home :size="17" />

            <div>
              <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-700">প্রতিষ্ঠান</div>
              <div class="text-xs text-slate-400">প্রতিষ্ঠানের তথ্য দেখুন</div>
            </div>
          </NuxtLink>
          <NuxtLink to="/classes"
            class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors group">
            <Layers :size="17" />

            <div>
              <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-700">ক্লাস</div>
              <div class="text-xs text-slate-400">ক্লাস পরিচালনা করুন</div>
            </div>
          </NuxtLink>
          <NuxtLink to="/subjects"
            class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors group">
            <BookMarked :size="17" />

            <div>
              <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-700">বিষয়</div>
              <div class="text-xs text-slate-400">বিষয় পরিচালনা করুন</div>
            </div>
          </NuxtLink>
          <NuxtLink to="/students"
            class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors group">
            <Users :size="17" />

            <div>
              <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-700">শিক্ষার্থী</div>
              <div class="text-xs text-slate-400">শিক্ষার্থী পরিচালনা করুন</div>
            </div>
          </NuxtLink>
        </div>
      </div>


      <AppCard>
        <template #header >
          মার্ক এন্ট্রি 
        </template>

        <p> একটি ক্লাস নির্বাচন করে মার্ক এন্ট্রি শুরু করুন। </p>

        <div class="w-full align-right">
          <NuxtLink class="flex items-center mt-3" to='mark'> শুরু করুন  <ChevronRight size="17" class="ml-3" /> </NuxtLink>
        </div>
      </AppCard>



      <AppCard>
        <template #header>
         রেজাল্ট তৈরি করুন
        </template>


        <div> 


        </div>
      </AppCard>
    </div>
  </div>
</template>


<style >

</style>
