<script setup lang="ts">
const route = useRoute();
const { loadBaseData, loadReport } = useResultReport();
const classes = ref<any[]>([]);
const students = ref<any[]>([]);
const classId = ref(Number(route.query.classId) || 0);
const studentId = ref(Number(route.query.studentId) || 0);
const examName = ref(String(route.query.examName || 'বার্ষিক পরীক্ষা'));
const report = ref<any>(null);

definePageMeta({ layout: false });

async function loadStudents() {
  const data = await loadBaseData();
  students.value = data.students.filter(item => item.classId === Number(classId.value));
}
async function load() {
  if (classId.value && studentId.value) report.value = await loadReport('student', classId.value, studentId.value);
}
onMounted(async () => {
  const data = await loadBaseData(); classes.value = data.classes; await loadStudents(); await load();
});
</script>

<template>
  <div class="bg-slate-100 print:bg-white">
    <div class="result-controls mx-auto flex max-w-[1100px] gap-3 px-4 py-5 print:hidden">
      <select v-model="classId" @change="loadStudents" class="rounded-lg border border-slate-300 px-3 py-2"><option v-for="item in classes" :key="item.id" :value="item.id">{{ item.name }}</option></select>
      <select v-model="studentId" @change="load" class="flex-1 rounded-lg border border-slate-300 px-3 py-2"><option v-for="item in students" :key="item.id" :value="item.id">{{ item.name }} (রোল {{ item.roll }})</option></select>
      <input v-model="examName" class="rounded-lg border border-slate-300 px-3 py-2" />
      <button @click="window.print()" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">প্রিন্ট / PDF</button>
    </div>
    <ResultPaper v-if="report?.studentSummary" :title="`${report.selectedClass?.name || ''} - শিক্ষার্থীর ফলাফল`" :subtitle="report.studentSummary.student.name" :institute="report.institute" :exam-name="examName">
      <div class="mb-5 grid grid-cols-4 gap-3 border border-slate-700 p-3 text-sm"><span>নাম: <b>{{ report.studentSummary.student.name }}</b></span><span>রোল: <b>{{ report.studentSummary.student.roll }}</b></span><span>ক্লাস: <b>{{ report.selectedClass?.name }}</b></span><span>GPA: <b>{{ report.studentSummary.gpa }}</b></span></div>
      <table class="result-table w-full border-collapse text-sm"><thead><tr><th>ক্রমিক</th><th class="text-left">বিষয়</th><th>পূর্ণমান</th><th>প্রাপ্ত নম্বর</th><th>শতাংশ</th><th>গ্রেড</th><th>গ্রেড পয়েন্ট</th></tr></thead><tbody><tr v-for="(row, index) in report.studentSummary.rows" :key="row.subject.id"><td>{{ index + 1 }}</td><td class="text-left font-semibold">{{ row.subject.name }}</td><td>{{ row.subject.total_mark || 100 }}</td><td>{{ row.mark }}</td><td>{{ row.percentage.toFixed(1) }}%</td><td>{{ row.label }}</td><td>{{ row.gradePoint.toFixed(2) }}</td></tr></tbody><tfoot><tr><th colspan="2" class="text-right">সর্বমোট</th><th>{{ report.studentSummary.totalFullMark }}</th><th>{{ report.studentSummary.total }}</th><th colspan="2">GPA</th><th>{{ report.studentSummary.gpa }}</th></tr></tfoot></table>
      <p class="mt-5 text-center text-lg font-bold" :class="report.studentSummary.passed ? 'text-emerald-700' : 'text-red-700'">{{ report.studentSummary.passed ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ' }}</p>
    </ResultPaper>
  </div>
</template>

<style>
@page { size: A4 landscape; margin: 0; }
.result-table th, .result-table td { border: 1px solid #334155; padding: 7px 8px; text-align: center; }
.result-table th { background: #e2e8f0; }
@media print { body { background: white; } .result-controls { display: none; } }
</style>