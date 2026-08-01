<script setup lang="ts">
const route = useRoute();
const { loadBaseData, loadReport, getGrade } = useResultReport();
const classes = ref<any[]>([]);
const subjects = ref<any[]>([]);
const classId = ref(Number(route.query.classId) || 0);
const subjectId = ref(Number(route.query.subjectId) || 0);
const examName = ref(String(route.query.examName || 'বার্ষিক পরীক্ষা'));
const report = ref<any>(null);

definePageMeta({ layout: false });

async function loadSubjects() {
  const data = await loadBaseData(); subjects.value = data.subjects.filter(item => item.classId === Number(classId.value));
}
async function load() { if (classId.value && subjectId.value) report.value = await loadReport('subject', classId.value, undefined, subjectId.value); }
onMounted(async () => { const data = await loadBaseData(); classes.value = data.classes; await loadSubjects(); await load(); });

const rows = computed(() => (report.value?.students || []).map(student => {
  const mark = report.value.marks.find(item => item.studentId === student.id && item.subjectId === report.value.subject?.id);
  const result = getGrade(Number(mark?.mark || 0), Number(report.value.subject?.total_mark || 100), report.value.criteria || []);
  return { student, mark: mark?.mark ?? '-', ...result };
}));
const chunks = computed(() => Array.from({ length: Math.max(1, Math.ceil(rows.value.length / 25)) }, (_, index) => rows.value.slice(index * 25, index * 25 + 25)));
</script>

<template>
  <div class="bg-slate-100 print:bg-white">
    <div class="result-controls mx-auto flex max-w-[1100px] gap-3 px-4 py-5 print:hidden">
      <select v-model="classId" @change="loadSubjects" class="rounded-lg border border-slate-300 px-3 py-2"><option v-for="item in classes" :key="item.id" :value="item.id">{{ item.name }}</option></select>
      <select v-model="subjectId" @change="load" class="flex-1 rounded-lg border border-slate-300 px-3 py-2"><option v-for="item in subjects" :key="item.id" :value="item.id">{{ item.name }}</option></select>
      <input v-model="examName" class="rounded-lg border border-slate-300 px-3 py-2" />
      <button @click="window.print()" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">প্রিন্ট / PDF</button>
    </div>
    <ResultPaper v-for="(pageRows, page) in chunks" v-if="report?.subject" :key="page" :title="`${report.selectedClass?.name || ''} - বিষয়ভিত্তিক ফলাফল`" :subtitle="`${report.subject.name} | ${page + 1} / ${chunks.length}`" :institute="report.institute" :exam-name="examName">
      <table class="result-table w-full border-collapse text-sm"><thead><tr><th>ক্রমিক</th><th>রোল</th><th class="text-left">শিক্ষার্থীর নাম</th><th>পূর্ণমান</th><th>প্রাপ্ত নম্বর</th><th>শতাংশ</th><th>গ্রেড</th><th>ফলাফল</th></tr></thead><tbody><tr v-for="(row, index) in pageRows" :key="row.student.id"><td>{{ page * 25 + index + 1 }}</td><td>{{ row.student.roll }}</td><td class="text-left font-semibold">{{ row.student.name }}</td><td>{{ report.subject.total_mark || 100 }}</td><td>{{ row.mark }}</td><td>{{ row.percentage.toFixed(1) }}%</td><td>{{ row.label }}</td><td :class="row.passed && row.mark !== '-' ? 'text-emerald-700' : 'text-red-700'">{{ row.passed && row.mark !== '-' ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ' }}</td></tr></tbody></table>
    </ResultPaper>
  </div>
</template>

<style>
@page { size: A4 landscape; margin: 0; }
.result-table th, .result-table td { border: 1px solid #334155; padding: 7px 8px; text-align: center; }
.result-table th { background: #e2e8f0; }
@media print { body { background: white; } .result-controls { display: none; } }
</style>