<script setup>
const { loadBaseData } = useResultReport();
const classes = ref([]);
const students = ref([]);
const subjects = ref([]);
const type = ref('class');
const classId = ref('');
const studentId = ref('');
const subjectId = ref('');
const examName = ref('বার্ষিক পরীক্ষা');
const searchClassName = ref([])

import {ChevronRight, Search} from "@lucide/vue";

definePageMeta({ layout: 'master' });

onMounted(async () => {
  const data = await loadBaseData();
  classes.value = data.classes.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  // classes.value = data.classes.filter(cls => cls.name == searchClassName.value)
});

async function onClassChange() {
  const data = await loadBaseData();
  const id = Number(classId.value);
  students.value = data.students.filter(item => item.classId === id).sort((a, b) => (a.roll ?? 0) - (b.roll ?? 0));
  subjects.value = data.subjects.filter(item => item.classId === id).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  studentId.value = '';
  subjectId.value = '';
}

const openReport = computed(() => {
  if (!classId.value) return;
  const path = `/result/${type.value}`;
  const params = new URLSearchParams({ classId: classId.value, examName: examName.value });
  if (type.value === 'student') params.set('studentId', studentId.value);
  if (type.value === 'subject') params.set('subjectId', subjectId.value);
  return `${path}?${params.toString()}`
  // window.open(`${path}?${params.toString()}`);
})


</script>

<template>

  <AppCard>
     <div class="">
        <label class="text-sm font-medium text-slate-700">পরীক্ষার নাম
          <input v-model="examName" class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5"
            placeholder="বার্ষিক পরীক্ষা" />
        </label>
      </div>
  </AppCard>

  <div class="lg:flex gap-3 mt-3">

    <div clas="flex flex-col gap-3">
      <AppCard class="max-w-md">
        <template #header>
          <div>
            <h1 class="text-xl font-bold text-slate-900">ফলাফল তৈরি করুন</h1>
            <p class="mt-1 text-sm text-slate-500">ফলাফল ধরন নির্বাচন করুন। </p>
          </div>
        </template>

      

        <div class="">
          <label class="text-sm font-medium text-slate-700">ফলাফলের ধরন
            <select v-model="type" class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5">
              <option value="class">ক্লাস ভিত্তিক ফলাফল</option>
              <option value="student">শিক্ষার্থী ভিত্তিক ফলাফল</option>
              <option value="subject">বিষয় ভিত্তিক ফলাফল</option>
            </select>
          </label>
          <label class="text-sm font-medium text-slate-700">ক্লাস
            <select v-model="classId" @change="onClassChange" class="mt-1.5 w-full rounded-lg border px-3 py-2.5">
              <option value="" disabled>ক্লাস নির্বাচন করুন</option>
              <option v-for="item in classes" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
          </label>
          <label v-if="type === 'student'" class="text-sm font-medium text-slate-700">শিক্ষার্থী
            <select v-model="studentId" class="mt-1.5 w-full rounded-lg border px-3 py-2.5">
              <option value="" disabled>শিক্ষার্থী নির্বাচন করুন</option>
              <option v-for="item in students" :key="item.id" :value="item.id">{{ item.name }} (রোল {{ item.roll }})
              </option>
            </select>
          </label>
          <label v-if="type === 'subject'" class="text-sm font-medium text-slate-700">বিষয়
            <select v-model="subjectId" class="mt-1.5 w-full rounded-lg border px-3 py-2.5">
              <option value="" disabled>বিষয় নির্বাচন করুন</option>
              <option v-for="item in subjects" :key="item.id" :value="item.id">{{ item.name }}</option>
            </select>
          </label>
        </div>

        <div class="mt-6 flex justify-end">
          <NuxtLink :to="openReport" class="inline-flex items-center justify-center rounded-lg font-semibold transition duration-200 bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 px-4 py-2 text-sm"
            :disabled="!classId || (type === 'student' && !studentId) || (type === 'subject' && !subjectId)"
            >
            ফলাফল দেখুন 
            <ChevronRight size="17" class="ml-2" />
          </NuxtLink>
        </div>
      </AppCard>

      <AppCard class="max-w-md">
        <template #header>
          <div>
            <h1 class="text-xl font-bold text-slate-900"> ক্লাস ভিত্তিক ফলাফল </h1>
            <p class="mt-1 text-sm text-slate-500"> যেকোন ক্লাসের দ্রুত ফলাফল দেখুন </p>
          </div>
        </template>


        <div v-if="classes.length > 0" class="flex flex-wrap gap-3">
          <div class="mb-3 flex items-center">
            <Search size="15" class="my-2 mx-3" />
            <input v-model="searchClassName" type="search" class="border rounded-lg px-2 py-1">
          </div> 
          <template v-for="clas in classes" >
            <NuxtLink :to="`/result/class?classId=${clas.id}&examName=${examName}`" class=" border rounded-md hover:bg-indigo-500 hover:text-white trnasition all-linear ">
              <div class="flex items-center justify-between px-3 py-2 w-[140px]">
                <span> {{clas.name}} </span>
                <ChevronRight size="17" />
              </div>
            </NuxtLink>
          </template>
        </div>

        <AppEmpty v-else > কোন ক্লাশ পাওয়া যায় নি।  </AppEmpty>
      </AppCard>
    </div>

    <AppCard class="flex-1">
      <template #header>
        <div>
          <h1 class="text-xl font-bold text-slate-900"> ফলাফল </h1>
          <p> তুলনামুলক ফলাফল বিশ্লেষণ  </p>
        </div>
      </template>
    </AppCard>
  </div>

</template>