<!--
Students Create Form — Create students for classes.
Supports multiple entries: form stays open after save.
-->
<script lang='ts' setup>
const ui = useUiStore();
const emit = defineEmits(['saved']);

const students = useStudents();
const classesData = ref([]);

const form = reactive({
  classId: '',
  name: '',
  roll: '',
});

// Success feedback
const justSaved = ref(false);
let successTimeout = null;

onMounted(async () => {
  await loadClasses();
});

async function loadClasses() {
  const cls = useClasses();
  const allClasses = await cls.all();
  classesData.value = [...allClasses].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
}

async function handleSubmit() {
  if (!form.classId || !form.name.trim() || !form.roll) return;

  ui.saving = true;
  try {
    await students.create({
      classId: Number(form.classId),
      name: form.name.trim(),
      roll: Number(form.roll),
    });

    // Show success feedback
    justSaved.value = true;
    if (successTimeout) clearTimeout(successTimeout);
    successTimeout = setTimeout(() => {
      justSaved.value = false;
    }, 3000);

    // Reset form for next entry — keep classId for convenience
    const currentClassId = form.classId;
    form.name = '';
    form.roll = '';
    form.classId = currentClassId;

    ui.showToast('success', `"${form.name || 'শিক্ষার্থী'}" যুক্ত হয়েছে`);

    await loadClasses();

    emit('saved');
  } catch (err) {
    ui.showToast('error', 'শিক্ষার্থী যুক্ত করতে সমস্যা হয়েছে: ' + (err.message || err));
  } finally {
    ui.saving = false;
  }
}

// Bulk import support
const importFile = ref(null as File | null);
const importing = ref(false);
const importResults = ref<any[]>([]);

function parseCSVRobust(text: string) {
  const rows: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"') {
      if (inQuotes && next === '"') { cur += '"'; i++; continue; }
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === '\n' && !inQuotes) { rows.push(cur.replace(/\r$/, '')); cur = ''; continue; }
    cur += ch;
  }
  if (cur.length) rows.push(cur.replace(/\r$/, ''));
  return rows.map(r => {
    // split by comma not inside quotes
    const cols: string[] = [];
    let c = '';
    let q = false;
    for (let i = 0; i < r.length; i++) {
      const ch = r[i];
      const nx = r[i + 1];
      if (ch === '"') { if (q && nx === '"') { c += '"'; i++; continue; } q = !q; continue; }
      if (ch === ',' && !q) { cols.push(c.trim()); c = ''; continue; }
      c += ch;
    }
    cols.push(c.trim());
    return cols;
  });
}

async function handleImportFile(e) {
  const f = e.target.files?.[0];
  if (!f) return;
  importFile.value = f;
}

async function importStudentsFile() {
  if (!importFile.value) { ui.showToast('error', 'একটি CSV ফাইল নির্বাচন করুন'); return; }
  importing.value = true;
  importResults.value = [];
  try {
    const text = await importFile.value.text();
    const parsed = parseCSVRobust(text);
    if (parsed.length < 2) { ui.showToast('error', 'CSV-এ হেডার এবং কমপক্ষে একটি সারি থাকা প্রয়োজন'); return; }
    const header = parsed[0].map(h => h.trim());
    // first header must represent class id
    const firstHeader = header[0].toLowerCase();
    if (!firstHeader.includes('class')) { ui.showToast('error', 'প্রথম কলামটি অবশ্যই ক্লাস আইডি থাকতে হবে (header: classId)'); return; }
    const rows = parsed.slice(1).map(cols => {
      const obj: any = {};
      header.forEach((h, i) => obj[h.trim()] = (cols[i] ?? '').trim());
      return obj;
    });

    // load classes map for validation
    const classes = await useClasses().all();
    const classIds = new Set(classes.map(c => c.id));

    const ops: Promise<any>[] = [];
    let success = 0; let failed = 0;
    for (const row of rows) {
      const clsVal = row[header[0]] || row[header[0].toLowerCase()];
      const classIdNum = Number(clsVal);
      const name = row.name || row.Name || '';
      const roll = row.roll || row.Roll || row.roll_no || row.rollno || '';
      const errors: string[] = [];
      if (!clsVal || !classIds.has(classIdNum)) errors.push('Invalid classId');
      if (!name) errors.push('Missing name');
      if (roll === '' || roll === undefined) errors.push('Missing roll');
      if (errors.length) { importResults.value.push({ row, ok: false, errors }); failed++; continue; }
      ops.push(useStudents().create({ classId: classIdNum, name: String(name).trim(), roll: Number(roll) }));
      importResults.value.push({ row, ok: true });
      success++;
    }
    await Promise.allSettled(ops);
    ui.showToast('success', `${success} সফলভাবে আমদানি হয়েছে, ${failed} ত্রুটি`);
    emit('saved');
  } catch (err) {
    ui.showToast('error', 'আমদানি করতে সমস্যা হয়েছে: ' + (err.message || err));
  } finally {
    importing.value = false;
    importFile.value = null;
    const el = document.querySelector('#students-import-file') as HTMLInputElement | null;
    if (el) el.value = '';
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Class Select -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5">ক্লাস <span class="text-red-500">*</span></label>
      <select v-model="form.classId" required
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
        <option value="" disabled>ক্লাস নির্বাচন করুন</option>
        <option v-for="cls in classesData" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
      </select>
    </div>

    <div class="flex items-start gap-4 flex-col sm:flex-row">
      <!-- Student Name -->
      <div class="flex-1 w-full">
        <label class="block text-sm font-medium text-gray-700 mb-1.5">শিক্ষার্থীর নাম <span
            class="text-red-500">*</span></label>
        <input v-model="form.name" type="text" required placeholder="যেমন: রহিম মিয়া"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
      </div>

      <!-- Roll -->
      <div class="w-full sm:w-32">
        <label class="block text-sm font-medium text-gray-700 mb-1.5">রোল নম্বর <span
            class="text-red-500">*</span></label>
        <input v-model="form.roll" type="number" required placeholder="যেমন: 1"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
      </div>
    </div>

    <!-- Success feedback -->
    <div v-if="justSaved" class="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      শিক্ষার্থী যুক্ত হয়েছে! আরও যোগ করুন অথবা নিচের "পরবর্তী ধাপ" বাটনে ক্লিক করুন।
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-2">
      <button type="submit" :disabled="ui.saving"
        class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2">
        <svg v-if="ui.saving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ ui.saving ? 'সংরক্ষণ হচ্ছে...' : 'শিক্ষার্থী যোগ করুন' }}
      </button>
    </div>
  </form>

  <!-- Bulk import section -->
  <div class="mt-6 p-4 border border-dashed border-slate-300 bg-slate-50 rounded-md">
    <h3 class="font-semibold mb-2">Bulk Import (CSV)</h3>
    <p class="text-sm text-slate-600 mb-3">প্রথম সারিতে হেডার দিতে হবে। প্রথম কলামটি অবশ্যই ক্লাস আইডি থাকবে, তারপর
      কলামগুলো হতে পারে: <strong>name, roll</strong>. উদাহরণ: <em>classId,name,roll</em></p>
    <input id="students-import-file" type="file" accept="text/csv" @change="handleImportFile" class="mb-2" />
    <div class="flex gap-2">
      <AppButton variant="primary" :disabled="importing" @click="importStudentsFile">
        Import CSV
      </AppButton>
      <button
        @click="() => { importFile = null; const el = document.querySelector('#students-import-file'); if (el) (el as HTMLInputElement).value = ''; }"
        class="px-3 py-2 rounded border">Clear
      </button>
    </div>
    <div v-if="importResults.length" class="mt-3 text-sm">
      <div v-for="(r, i) in importResults" :key="i" class="py-1">
        <span v-if="r.ok" class="text-emerald-700">Row {{ i + 1 }}: Imported</span>
        <span v-else class="text-red-700">Row {{ i + 1 }}: {{ r.errors.join(', ') }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from {
  opacity: 0;
  transform: translateY(-4px);
}

.v-leave-to {
  opacity: 0;
}
</style>
