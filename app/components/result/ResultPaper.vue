<script setup lang="ts">
import { DEFAULT_RESULT_PREVIEW_SETTINGS, type ResultPreviewSettings } from '~/composables/useSettings';
import { Printer, Save, File, Bolt } from '@lucide/vue'

const footerText = ref('');

const props = withDefaults(defineProps<{
  title: string;
  subtitle?: string;
  institute?: any;
  examName: string;
  settings?: Partial<ResultPreviewSettings>;
  isFirstPage?: boolean;
}>(), {
  settings: () => ({}),
  isFirstPage: true,
});

const emit = defineEmits<{
  settingsChange: [settings: ResultPreviewSettings];
  'update:examName': [value: string];
  'update:instituteName': [value: string];
}>();

const isFirstPage = computed(() => props.isFirstPage);
const settingsOpen = ref(false);
const settings = ref<ResultPreviewSettings>({ ...DEFAULT_RESULT_PREVIEW_SETTINGS, ...props.settings });
const localExamName = ref(props.examName);
const localInstituteName = ref(props.institute?.name || 'Academic Institution');

watch(() => props.settings, (value) => {
  settings.value = { ...DEFAULT_RESULT_PREVIEW_SETTINGS, ...value };
}, { deep: true });

watch(() => props.examName, (value) => {
  localExamName.value = value;
});

watch(() => props.institute?.name, (value) => {
  localInstituteName.value = value || 'Academic Institution';
});

watch(localExamName, (value, oldValue) => {
  if (oldValue !== undefined && value !== oldValue) {
    emit('update:examName', value);
  }
});

watch(localInstituteName, (value, oldValue) => {
  if (oldValue !== undefined && value !== oldValue) {
    emit('update:instituteName', value);
  }
});

const pageStyle = computed(() => {
  const margin = settings.value.pageMargin === 'small' ? '10mm' : settings.value.pageMargin === 'large' ? '25mm' : '14mm';
  const dimensions = {
    A4: { landscape: { width: '297mm', height: '210mm' }, portrait: { width: '210mm', height: '297mm' } },
    A3: { landscape: { width: '420mm', height: '297mm' }, portrait: { width: '297mm', height: '420mm' } },
    Letter: { landscape: { width: '279.4mm', height: '215.9mm' }, portrait: { width: '215.9mm', height: '279.4mm' } },
  };
  const size = dimensions[settings.value.pageSize][settings.value.orientation];
  return {
    width: size.width,
    minHeight: size.height,
    padding: margin,
  };
});

async function loadSettings() {
  settings.value = { ...DEFAULT_RESULT_PREVIEW_SETTINGS, ...(await useSettings().first()) };
}

async function saveSettings() {
  await useSettings().upsert(settings.value);
  emit('settingsChange', { ...settings.value });
  settingsOpen.value = false;
}

function printReport() {
  window.print();
}
</script>

<template>
  <div class="result-page min-h-screen bg-slate-100 px-4 py-6 text-slate-900 print:bg-white print:p-0">
    <div
      class="rounded-xl result-controls-float fixed bottom-5 right-5 z-50 flex flex-col  ittems-center justify-center gap-3 print:hidden bg-white shadow-xl p-2">

      <button class="p-3 rounded-xl hover:bg-slate-100" type="button" @click="printReport">
        <Printer />
      </button>

      <button class="p-3 rounded-xl hover:bg-slate-100" type="button" title="ফলাফল প্রিভিউ সেটিংস"
        @click="settingsOpen = true; loadSettings()">
        <Bolt />
      </button>

      <button class="p-3 rounded-xl hover:bg-slate-100" type="button" @click="printReport">
        <File />
      </button>
    </div>

    <AppModal title="ফলাফল প্রিভিউ সেটিংস" :open="settingsOpen" @close="settingsOpen = false">
      <div class="space-y-4">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label
            class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
            <span class="text-sm font-medium text-slate-700">ফুটার দেখান</span>
            <input v-model="settings.showFooter" type="checkbox" class="h-4 w-4 accent-indigo-600" />
          </label>
          <label
            class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
            <span class="text-sm font-medium text-slate-700">ওয়াটারমার্ক দেখান</span>
            <input v-model="settings.showWatermark" type="checkbox" class="h-4 w-4 accent-indigo-600" />
          </label>
          <label
            class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
            <span class="text-sm font-medium text-slate-700">বিষয় পূর্ণমান দেখান</span>
            <input v-model="settings.showSubjectTotalMark" type="checkbox" class="h-4 w-4 accent-indigo-600" />
          </label>
          <label
            class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
            <span class="text-sm font-medium text-slate-700">মার্কের নিচে গ্রেড লেবেল দেখান</span>
            <input v-model="settings.showRowGradeLabel" type="checkbox" class="h-4 w-4 accent-indigo-600" />
          </label>
          <label
            class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
            <span class="text-sm font-medium text-slate-700">মোট নম্বর দেখান</span>
            <input v-model="settings.showTotalMark" type="checkbox" class="h-4 w-4 accent-indigo-600" />
          </label>
          <label
            class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
            <span class="text-sm font-medium text-slate-700">GPA দেখান</span>
            <input v-model="settings.showGpa" type="checkbox" class="h-4 w-4 accent-indigo-600" />
          </label>
          <label
            class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
            <span class="text-sm font-medium text-slate-700">শতাংশ দেখান</span>
            <input v-model="settings.showPercentage" type="checkbox" class="h-4 w-4 accent-indigo-600" />
          </label>
          <label
            class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
            <span class="text-sm font-medium text-slate-700">গ্রেড দেখান</span>
            <input v-model="settings.showGrade" type="checkbox" class="h-4 w-4 accent-indigo-600" />
          </label>
          <label
            class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
            <span class="text-sm font-medium text-slate-700">গ্রেড পয়েন্ট দেখান</span>
            <input v-model="settings.showGradePoint" type="checkbox" class="h-4 w-4 accent-indigo-600" />
          </label>
          <label
            class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
            <span class="text-sm font-medium text-slate-700">ফলাফল দেখান</span>
            <input v-model="settings.showResult" type="checkbox" class="h-4 w-4 accent-indigo-600" />
          </label>
        </div>
        <!-- <hr class="my-2" />
        <div class="py-2">
          <label class="block text-sm font-medium text-slate-700 mb-2">ওয়াটারমার্ক </label>
        </div> -->
        <hr class="my-2" />
        <div class="grid gap-3 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">পেপার সাইজ</label>
            <select v-model="settings.pageSize"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900 focus:ring-0">
              <option value="A4">A4</option>
              <option value="A3">A3</option>
              <option value="Letter">Letter</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">অরিয়েন্টেশন</label>
            <select v-model="settings.orientation"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900 focus:ring-0">
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">মার্জিন</label>
            <select v-model="settings.pageMargin"
              class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-slate-900 focus:ring-0">
              <option value="small">Small</option>
              <option value="normal">Normal</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end pt-2">
          <AppButton variant="primary" type="button" @click="saveSettings">সংরক্ষণ করুন</AppButton>
        </div>
      </div>
    </AppModal>

    <article
      class="result-paper relative mx-auto min-h-[210mm] w-full max-w-[297mm] overflow-hidden bg-white p-[14mm] shadow-xl print:min-h-0 print:max-w-none print:shadow-none"
      :style="pageStyle">
      <!-- watermark -->
      <div v-if="settings.showWatermark"
        class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.045]">
        <div class="rotate-[-25deg] text-center text-7xl font-black uppercase tracking-[0.2em]">{{ localInstituteName ||
          'Result Studio' }}</div>
      </div>

      <header class="relative border-b-2 border-slate-900 pb-4 text-center">
        <input v-model="localInstituteName" placeholder="Institute name"
          class="mx-auto block w-full max-w-[600px] border-0 border-b border-slate-300 bg-transparent pb-2 text-2xl font-bold uppercase tracking-wide text-center focus:outline-none focus:border-slate-900" />
        <p v-if="institute?.address" class="mt-1 text-sm">{{ institute.address }}</p>
        <input v-model="localExamName" placeholder="Exam name"
          class="mx-auto mt-3 block w-full max-w-[420px] border-0 border-b border-slate-300 bg-transparent pb-2 text-lg font-bold uppercase tracking-wide text-center focus:outline-none focus:border-slate-900" />
        <p class="mt-1 text-sm font-semibold">{{ title }}</p>
      </header>

      <div class="relative mt-4 flex items-center justify-between border-b border-slate-300 pb-3 text-xs">
        <span>সেশন: {{ institute?.session || '................' }}</span>
        <span>প্রকাশের তারিখ: {{ new Date().toLocaleDateString('en-GB') }}</span>
        <span>ফলাফল: {{ subtitle || 'Academic Result' }}</span>
      </div>

      <section class="relative mt-5">
        <slot></slot>
      </section>

      <footer v-if="settings.showFooter" class="relative mt-12 grid grid-cols-3 gap-8 pt-8 text-center text-xs">
        <div class="border-t border-slate-800 pt-2">শ্রেণি শিক্ষক</div>
        <div class="border-t border-slate-800 pt-2">পরীক্ষা নিয়ন্ত্রক</div>
        <div class="border-t border-slate-800 pt-2">প্রধান শিক্ষক</div>
      </footer>
    </article>
  </div>
</template>

<style>
@page {
  size: A4 landscape;
  margin: 0;
}

@media print {
  body {
    background: white;
  }

  .result-paper {
    break-after: page;
  }

  .result-paper:last-child {
    break-after: auto;
  }
}
</style>