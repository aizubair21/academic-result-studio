<script setup lang="ts">
const { loadBaseData } = useResultReport();
const classes = ref<any[]>([]);
const students = ref<any[]>([]);
const subjects = ref<any[]>([]);
const type = ref('class');
const classId = ref('');
const studentId = ref('');
const subjectId = ref('');
const examName = ref('বার্ষিক পরীক্ষা');

definePageMeta({ layout: 'master' });

onMounted(async () => {
  const data = await loadBaseData();
  classes.value = data.classes.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
});

async function onClassChange() {
  const data = await loadBaseData();
  const id = Number(classId.value);
  students.value = data.students.filter(item => item.classId === id).sort((a, b) => (a.roll ?? 0) - (b.roll ?? 0));
  subjects.value = data.subjects.filter(item => item.classId === id).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  studentId.value = '';
  subjectId.value = '';
}

function openReport() {
  if (!classId.value) return;
  const path = `/result/${type.value}`;
  const params = new URLSearchParams({ classId: classId.value, examName: examName.value });
  if (type.value === 'student') params.set('studentId', studentId.value);
  if (type.value === 'subject') params.set('subjectId', subjectId.value);
  window.open(`${path}?${params.toString()}`, '_blank', 'noopener,noreferrer');
}
</script>

<template>
  <AppCard>
    <template #header>
      <div>
        <h1 class="text-3xl font-bold text-slate-900">ফলাফল তৈরি করুন</h1>
        <p class="mt-1 text-sm text-slate-500">একাডেমিক ফলাফল বেছে নিয়ে আলাদা প্রিন্ট পেজে খুলুন</p>
      </div>
    </template>

    <div class="grid gap-5 md:grid-cols-2">
      <label class="text-sm font-medium text-slate-700">ফলাফলের ধরন
        <select v-model="type" class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5">
          <option value="class">ক্লাস ভিত্তিক ফলাফল</option>
          <option value="student">শিক্ষার্থী ভিত্তিক ফলাফল</option>
          <option value="subject">বিষয় ভিত্তিক ফলাফল</option>
        </select>
      </label>
      <label class="text-sm font-medium text-slate-700">পরীক্ষার নাম
        <input v-model="examName" class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5" placeholder="বার্ষিক পরীক্ষা" />
      </label>
      <label class="text-sm font-medium text-slate-700">ক্লাস
        <select v-model="classId" @change="onClassChange" class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5">
          <option value="" disabled>ক্লাস নির্বাচন করুন</option>
          <option v-for="item in classes" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </label>
      <label v-if="type === 'student'" class="text-sm font-medium text-slate-700">শিক্ষার্থী
        <select v-model="studentId" class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5">
          <option value="" disabled>শিক্ষার্থী নির্বাচন করুন</option>
          <option v-for="item in students" :key="item.id" :value="item.id">{{ item.name }} (রোল {{ item.roll }})</option>
        </select>
      </label>
      <label v-if="type === 'subject'" class="text-sm font-medium text-slate-700">বিষয়
        <select v-model="subjectId" class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5">
          <option value="" disabled>বিষয় নির্বাচন করুন</option>
          <option v-for="item in subjects" :key="item.id" :value="item.id">{{ item.name }}</option>
        </select>
      </label>
    </div>

    <div class="mt-6 flex justify-end">
      <button type="button" :disabled="!classId || (type === 'student' && !studentId) || (type === 'subject' && !subjectId)" @click="openReport" class="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
        নতুন ট্যাবে ফলাফল খুলুন
      </button>
    </div>
  </AppCard>
</template>