<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
  institute?: any;
  examName: string;
}>();

function printReport() {
  window.print();
}
</script>

<template>
  <div class="result-page min-h-screen bg-slate-100 px-4 py-6 text-slate-900 print:bg-white print:p-0">
    <div class="result-controls mx-auto mb-5 flex max-w-[1100px] items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm print:hidden">
      <div>
        <p class="text-sm font-semibold text-slate-800">{{ title }}</p>
        <p class="text-xs text-slate-500">{{ subtitle }}</p>
      </div>
      <button type="button" @click="printReport" class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
        প্রিন্ট / PDF ডাউনলোড
      </button>
    </div>

    <article class="result-paper relative mx-auto min-h-[210mm] w-full max-w-[297mm] overflow-hidden bg-white p-[14mm] shadow-xl print:min-h-0 print:max-w-none print:shadow-none">
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

      <footer class="relative mt-12 grid grid-cols-3 gap-8 pt-8 text-center text-xs">
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