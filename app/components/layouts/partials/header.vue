<script lang="ts" setup>
const ui = useUiStore();
const settingsOpen = ref(false);
const confirmReset = ref(false);

// Settings state
const settings = ref({
  resultType: 'GPA',
});

// Grade criteria state
const selectedGradeClassId = ref(null);
const gradeCriteriaList = ref([]);
const classList = ref([]);

// Sync with uiStore sidebarOpen
const sidebarOpen = computed({
  get: () => ui.sidebarOpen,
  set: (val) => { ui.sidebarOpen = val; },
});

// Load settings on modal open
watch(settingsOpen, async (open) => {
  if (open) {
    await loadSettings();
    await loadClasses();
  }
});

async function loadSettings() {
  try {
    const settingsRepo = useSettings();
    const data = await settingsRepo.first();
    if (data) {
      settings.value.resultType = data.resultType || 'GPA';
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
}

async function loadClasses() {
  try {
    const cls = useClasses();
    const allClasses = await cls.all();
    classList.value = [...allClasses].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
  } catch (err) {
    console.error('Failed to load classes:', err);
  }
}

async function saveResultType() {
  ui.saving = true;
  try {
    const settingsRepo = useSettings();
    await settingsRepo.upsert({ resultType: settings.value.resultType });
    ui.showToast('success', 'রেজাল্ট টাইপ সংরক্ষিত হয়েছে');
  } catch (err) {
    ui.showToast('error', 'সংরক্ষণে সমস্যা: ' + err);
  } finally {
    ui.saving = false;
  }
}

async function onGradeClassChange() {
  if (!selectedGradeClassId.value) {
    gradeCriteriaList.value = [];
    return;
  }
  try {
    const gradeCriteria = useGradeCriteria();
    const existing = await gradeCriteria.getByClass(Number(selectedGradeClassId.value));
    if (existing) {
      gradeCriteriaList.value = existing.sort((a, b) => b.maxMark - a.maxMark);
    } else {
      // Load defaults
      gradeCriteriaList.value = DEFAULT_GRADE_CRITERIA.map(c => ({ ...c }));
    }
  } catch (err) {
    console.error('Failed to load grade criteria:', err);
    gradeCriteriaList.value = DEFAULT_GRADE_CRITERIA.map(c => ({ ...c }));
  }
}

async function setDefaultGradeCriteria() {
  if (!selectedGradeClassId.value) return;
  gradeCriteriaList.value = DEFAULT_GRADE_CRITERIA.map(c => ({ ...c }));
  await saveGradeCriteria();
  ui.showToast('success', 'ডিফল্ট গ্রেড ক্রাইটেরিয়া সেট করা হয়েছে');
}

async function saveGradeCriteria() {
  if (!selectedGradeClassId.value) return;
  ui.saving = true;
  try {
    const gradeCriteria = useGradeCriteria();
    await gradeCriteria.setForClass(Number(selectedGradeClassId.value), gradeCriteriaList.value);
    ui.showToast('success', 'গ্রেড ক্রাইটেরিয়া সংরক্ষিত হয়েছে');
  } catch (err) {
    ui.showToast('error', 'সংরক্ষণে সমস্যা: ' + err);
  } finally {
    ui.saving = false;
  }
}

async function handleResetAll() {
  try {
    const { db } = useDatabase();
    
    // Clear all database tables
    await db.workspace.clear();
    await db.institute.clear();
    await db.classes.clear();
    await db.subjects.clear();
    await db.students.clear();
    await db.marks.clear();
    await db.resultCache.clear();
    await db.settings.clear();
    await db.gradeCriteria.clear();

    // Reset all stores
    useUiStore().resetAll();
    useWidgetStore().reset();
    useDbStore().reset();

    // Reset workflow
    useWidgetStore().workflow.current = 'institute';

    // Close modal and show success
    settingsOpen.value = false;
    confirmReset.value = false;
    
    // Force navigate to home
    navigateTo('/');
    
    ui.showToast('success', 'সমস্ত ডাটা রিসেট করা হয়েছে');
  } catch (err) {
    ui.showToast('error', 'রিসেট করতে সমস্যা: ' + err);
  }
}
</script>

<template>
  
    <header class="sticky top-0 z-40 h-[72px] border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
            
          </div>
          <div>
            <div class="text-base font-semibold text-slate-900">Result Studio</div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <!-- Mobile: Right sidebar toggle -->
            <button
            class="bottom-[30px] inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            title="Settings"
            @click="settingsOpen = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          <button
            class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50 md:hidden"
            title="Toggle sidebar"
            @click="sidebarOpen = !sidebarOpen"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
         
          
        </div>
      </div>
    </header>


    <!-- Settings Modal -->
    <AppModal title="সেটিংস" :open="settingsOpen" @close="settingsOpen = false">
      <div class="space-y-6">
        
        <!-- ─── Result Type Settings ─── -->
        <AppCard subtitle="সিস্টেম" title="রেজাল্ট টাইপ">
          <template #default>
            <div class="space-y-3">
              <p class="text-sm text-slate-600">রেজাল্টের ধরন নির্বাচন করুন (GPA বা CGPA)</p>
              
              <div class="flex gap-4">
                <label class="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-slate-50 transition"
                  :class="settings.resultType === 'GPA' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'"
                >
                  <input type="radio" v-model="settings.resultType" value="GPA" class="w-4 h-4 text-indigo-600" />
                  <div>
                    <div class="font-medium text-slate-800">GPA</div>
                    <div class="text-xs text-slate-500">গ্রেড পয়েন্ট এভারেজ (৫.০০ স্কেল)</div>
                  </div>
                </label>
                <label class="flex items-center gap-3 cursor-pointer p-3 border rounded-lg hover:bg-slate-50 transition"
                  :class="settings.resultType === 'CGPA' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200'"
                >
                  <input type="radio" v-model="settings.resultType" value="CGPA" class="w-4 h-4 text-indigo-600" />
                  <div>
                    <div class="font-medium text-slate-800">CGPA</div>
                    <div class="text-xs text-slate-500">কিউমুলেটিভ গ্রেড পয়েন্ট এভারেজ</div>
                  </div>
                </label>
              </div>

              <div class="flex justify-end pt-2">
                <button @click="saveResultType" :disabled="ui.saving"
                  class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {{ ui.saving ? 'সেইভ হচ্ছে...' : 'সেইভ' }}
                </button>
              </div>
            </div>
          </template>
        </AppCard>

        <!-- ─── Grade Criteria Settings ─── -->
        <AppCard subtitle="গ্রেডিং" title="গ্রেড ক্রাইটেরিয়া">
          <template #default>
            <div class="space-y-3">
              <p class="text-sm text-slate-600">প্রতি ক্লাসের জন্য গ্রেড নির্ধারণ করুন (মার্ক রেঞ্জ অনুযায়ী)</p>
              
              <!-- Class Selector for Grade Criteria -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">ক্লাস নির্বাচন করুন</label>
                <select v-model="selectedGradeClassId" @change="onGradeClassChange"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                >
                  <option :value="null" selected>ক্লাস নির্বাচন করুন</option>
                  <option v-for="cls in classList" :key="cls.id" :value="cls.id">
                    {{ cls.name }}
                  </option>
                </select>
              </div>

              <!-- Grade Criteria Table -->
              <div v-if="selectedGradeClassId && gradeCriteriaList.length > 0" class="overflow-x-auto border rounded-lg">
                <table class="min-w-full text-sm">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="px-3 py-2 text-left font-medium text-slate-600">গ্রেড</th>
                      <th class="px-3 py-2 text-left font-medium text-slate-600">নূন্যতম মার্ক</th>
                      <th class="px-3 py-2 text-left font-medium text-slate-600">সর্বোচ্চ মার্ক</th>
                      <th class="px-3 py-2 text-left font-medium text-slate-600">গ্রেড পয়েন্ট</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    <tr v-for="(crit, index) in gradeCriteriaList" :key="crit.id || index">
                      <td class="px-3 py-2">
                        <input v-model="crit.label" class="w-16 px-2 py-1 border rounded text-center font-medium" />
                      </td>
                      <td class="px-3 py-2">
                        <input v-model.number="crit.minMark" type="number" class="w-20 px-2 py-1 border rounded text-center" />
                      </td>
                      <td class="px-3 py-2">
                        <input v-model.number="crit.maxMark" type="number" class="w-20 px-2 py-1 border rounded text-center" />
                      </td>
                      <td class="px-3 py-2">
                        <input v-model.number="crit.gradePoint" type="number" step="0.5" class="w-20 px-2 py-1 border rounded text-center" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div v-else-if="selectedGradeClassId && gradeCriteriaList.length === 0" class="text-center py-4 text-slate-500">
                <p>এই ক্লাসের জন্য কোনো গ্রেড ক্রাইটেরিয়া সেট করা নেই।</p>
              </div>

              <div v-if="selectedGradeClassId" class="flex gap-2 pt-2">
                <button @click="setDefaultGradeCriteria" 
                  class="px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition"
                >
                  ডিফল্ট সেট করুন
                </button>
                <button @click="saveGradeCriteria" :disabled="ui.saving"
                  class="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                  {{ ui.saving ? 'সেইভ হচ্ছে...' : 'গ্রেড সংরক্ষণ' }}
                </button>
              </div>
            </div>
          </template>
        </AppCard>

        <!-- ─── Reset All ─── -->
        <AppCard subtitle="রিসেট" title="সবকিছু রিসেট করুন">
          <template #default>
            <div class="space-y-3">
              <p class="text-sm text-slate-600">
                সমস্ত ডাটা (প্রতিষ্ঠান, ক্লাস, বিষয়, শিক্ষার্থী, মার্ক, সেটিংস) মুছে ফেলুন এবং ওয়ার্কফ্লো রিসেট করুন।
                <span class="text-red-500 font-medium">এই কাজটি অপরিবর্তনীয়।</span>
              </p>
              <div v-if="!confirmReset" class="flex justify-end">
                <button @click="confirmReset = true"
                  class="px-6 py-2.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition font-medium"
                >
                  সবকিছু রিসেট করুন
                </button>
              </div>
              <div v-else class="space-y-3">
                <div class="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  আপনি কি নিশ্চিত? সমস্ত ডাটা চিরতরে মুছে যাবে।
                </div>
                <div class="flex justify-end gap-2">
                  <button @click="confirmReset = false"
                    class="px-4 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition"
                  >
                    বাতিল
                  </button>
                  <button @click="handleResetAll"
                    class="px-6 py-2.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition font-medium"
                  >
                    হ্যাঁ, রিসেট করুন
                  </button>
                </div>
              </div>
            </div>
          </template>
        </AppCard>

        <div class="flex justify-end">
          <AppButton variant="primary" size="md" @click="settingsOpen = false">Done</AppButton>
        </div>
      </div>
    </AppModal>
</template>

<style lang="postcss" scoped>
    
</style>
