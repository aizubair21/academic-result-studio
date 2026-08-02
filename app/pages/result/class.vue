<script setup lang="ts">
const route = useRoute();
const { loadBaseData, loadReport } = useResultReport();
const classes = ref<any[]>([]);
const classId = ref(Number(route.query.classId) || 0);
const examName = ref(String(route.query.examName || 'বার্ষিক পরীক্ষা'));
const report = ref<any>(null);
const loading = ref(true);

definePageMeta({ layout: false });

const chunks = computed(() => {
  const rows = report.value?.studentSummaries || [];
  return Array.from({ length: Math.max(1, Math.ceil(rows.length / 18)) }, (_, index) => rows.slice(index * 18, index * 18 + 18));
});

async function load() {
  if (!classId.value) return;
  loading.value = true;
  report.value = await loadReport('class', classId.value);
  loading.value = false;
}

onMounted(async () => {
  const data = await loadBaseData();
  classes.value = data.classes;
  await load();
});
</script>

<template>
  <div class="bg-slate-100 print:bg-white">
    <div class="result-controls mx-auto flex max-w-[1100px] gap-3 py-5 border-b print:hidden">
      <select v-model="classId" @change="load" class="rounded-lg border border-slate-300 px-3 py-2">
        <option v-for="item in classes" :key="item.id" :value="item.id">{{ item.name }}</option>
      </select>
      <input v-model="examName" class="flex-1 rounded-lg border border-slate-300 px-3 py-2" />
      <!-- <button @click="window.print()" class="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white">প্রিন্ট / PDF</button> -->
    </div>
    <div v-if="loading" class="p-10 text-center print:hidden">ফলাফল তৈরি হচ্ছে...</div>

    <template v-else-if="report">
      <ResultPaper v-for="(rows, page) in chunks" :key="page"
        :title="`${report.selectedClass?.name || ''} - শ্রেণির ফলাফল`" :subtitle="`${page + 1} / ${chunks.length}`"
        :institute="report.institute" :exam-name="examName" :settings="report.settings"
        @settings-change="report.settings = $event" @update:examName="examName = $event"
        @update:instituteName="report.institute = { ...report.institute, name: $event }">
        <table class="result-table w-full border-collapse text-xs">
          <thead>
            <tr>
              <th>ক্রমিক</th>
              <th>রোল</th>
              <th>শিক্ষার্থীর নাম</th>
              <th v-for="subject in report.subjects" :key="subject.id">{{ subject.name }}<br><small
                  v-if="report.settings.showSubjectTotalMark">{{
                    subject.total_mark || 100 }}</small></th>
              <th v-if="report.settings.showTotalMark">মোট</th>
              <th v-if="report.settings.showGpa">GPA</th>
              <th v-if="report.settings.showResult">ফলাফল</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(summary, index) in rows" :key="summary.student.id">
              <td>{{ page * 18 + index + 1 }}</td>
              <td>{{ summary.student.roll }}</td>
              <td class="text-left font-semibold">{{ summary.student.name }}</td>
              <td v-for="row in summary.rows" :key="row.subject.id">{{ row.mark }}<br><small
                  v-if="report.settings.showRowGradeLabel">{{ row.label }}</small>
              </td>
              <td v-if="report.settings.showTotalMark">{{ summary.total }}/{{ summary.totalFullMark }}</td>
              <td v-if="report.settings.showGpa">{{ summary.gpa }}</td>
              <td v-if="report.settings.showResult" :class="summary.passed ? 'text-emerald-700' : 'text-red-700'">{{
                summary.passed ? 'উত্তীর্ণ' : 'অনুত্তীর্ণ' }}</td>
            </tr>
          </tbody>
        </table>
      </ResultPaper>
    </template>
  </div>
</template>

<style>
@page {
  size: A4 landscape;
  margin: 0;
}

.result-table th,
.result-table td {
  border: 1px solid #334155;
  padding: 5px 6px;
  text-align: center;
  vertical-align: middle;
}

.result-table th {
  background: #e2e8f0;
  font-weight: 700;
}

.result-table small {
  color: #64748b;
  font-size: 9px;
}

@media print {
  body {
    background: white;
  }

  .result-controls {
    display: none;
  }
}
</style>