<script setup lang="ts">
import { DEFAULT_RESULT_PREVIEW_SETTINGS, type ResultPreviewSettings } from '~/composables/useSettings';

const props = withDefaults(defineProps<{
  title: string;
  subtitle?: string;
  institute?: any;
  examName: string;
  settings?: Partial<ResultPreviewSettings>;
}>(), {
  settings: () => ({}),
});

const emit = defineEmits<{
  settingsChange: [settings: ResultPreviewSettings];
}>();

const settingsOpen = ref(false);
const settings = ref<ResultPreviewSettings>({ ...DEFAULT_RESULT_PREVIEW_SETTINGS, ...props.settings });

watch(() => props.settings, (value) => {
  settings.value = { ...DEFAULT_RESULT_PREVIEW_SETTINGS, ...value };
}, { deep: true });

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
    <div class="result-controls mx-auto mb-5 flex max-w-[1100px] items-center justify-between gap-3 print:hidden">
      <div class="flex items-center justify-between gap-4">
        <AppButton variant="primary" type="button" title="ফলাফল প্রিভিউ সেটিংস" @click="settingsOpen = true; loadSettings()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </AppButton>
        <AppButton variant="secondary" type="button" @click="printReport" >
              প্রিন্ট / PDF ডাউনলোড
        </AppButton>
      </div>
    </div>

    <AppModal title="ফলাফল প্রিভিউ সেটিংস" :open="settingsOpen" @close="settingsOpen = false">
      <div class="space-y-3">
        <label v-for="option in [
          { key: 'showFooter', label: 'ফুটার দেখান' },
          { key: 'showTotalMark', label: 'মোট নম্বর দেখান' },
          { key: 'showGpa', label: 'GPA দেখান' },
          { key: 'showPercentage', label: 'শতাংশ দেখান' },
          { key: 'showGrade', label: 'গ্রেড দেখান' },
          { key: 'showGradePoint', label: 'গ্রেড পয়েন্ট দেখান' },
          { key: 'showResult', label: 'ফলাফল দেখান' },
        ]" :key="option.key" class="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50">
          <span class="text-sm font-medium text-slate-700">{{ option.label }}</span>
          <input v-model="settings[option.key as keyof ResultPreviewSettings]" type="checkbox" class="h-4 w-4 accent-indigo-600" />
        </label>
        <div class="flex justify-end pt-2">
          <AppButton variant="primary" type="button" @click="saveSettings">সংরক্ষণ করুন</AppButton>
        </div>
      </div>
    </AppModal>

    <article class="result-paper relative mx-auto min-h-[210mm] w-full max-w-[297mm] overflow-hidden bg-white p-[14mm] shadow-xl print:min-h-0 print:max-w-none print:shadow-none">

      <!-- watermark -->
      <div class="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.045]">
        <div class="rotate-[-25deg] text-center text-7xl font-black uppercase tracking-[0.2em]">{{ institute?.name || 'Result Studio' }}</div>
      </div>

      <header class="relative border-b-2 border-slate-900 pb-4 text-center">
        <h1 class="text-2xl font-bold uppercase tracking-wide">{{ institute?.name || 'Academic Institution' }}</h1>
        <p v-if="institute?.address" class="mt-1 text-sm">{{ institute.address }}</p>
        <h2 class="mt-3 text-lg font-bold uppercase">{{ examName }}</h2>
        <p class="mt-1 text-sm font-semibold">{{ title }}</p>
      </header>

      <div class="relative mt-4 flex items-center justify-between border-b border-slate-300 pb-3 text-xs">
        <span>সেশন: {{ institute?.session || '................' }}</span>
        <span>প্রকাশের তারিখ: {{ new Date().toLocaleDateString('en-GB') }}</span>
        <span>ফলাফল: {{ subtitle || 'Academic Result' }}</span>
      </div>

      <section class="relative mt-5">
        <slot />
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
@page { size: A4 landscape; margin: 0; }
@media print {
  body { background: white; }
  .result-paper { break-after: page; }
  .result-paper:last-child { break-after: auto; }
}
</style>