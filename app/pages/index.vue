<script lang="ts" setup>
import { ref } from 'vue'

const showModal = ref(false)
const email = ref('')
const studentCount = 128
const classCount = 6
const subjectCount = 8
const actions = [
  { label: 'Export PDF', onClick: () => alert('Export selected') },
  { label: 'New Report', onClick: () => (showModal.value = true) },
]

const tableHeaders = ['নাম', 'রোল', 'বিষয়', 'মার্কস', 'গ্রেড']
const tableRows = [
  ['রাফি হাসান', '১২', 'গণিত', '৮৮', 'A+'],
  ['সাবিনা সুলতানা', '১৪', 'বাংলা', '৯০০', 'A'],
  ['মাহিনুর রহমান', '৮', ' ইংরেজি', '৮২', 'A'],
]
const classes = {
    tableHeader: ['শ্রেণী', 'ক্রম', 'বিষয় সংখ্যা'],
    loop: 
    [
        ['৬ষ্ঠ শ্রেণী', '৬ষ্ঠ', '৯ বিষয়'],
        ['৭ম শ্রেণী', '৭ম', '৯ বিষয়'],
        ['৫ম শ্রেণী', '৫ম', '৮ বিষয়'],
    ]
}

const subjects = 
{
    tableHeader : ['বিষয়', 'শ্রেণী', 'পূর্ণমান', 'পাশ মার্ক'], 
    loop : [
        [ 'বাংলা', '৯ম শ্রেণী', '১০০', '৩৩'],
        [ 'ইংরেজী', '৭ম শ্রেণী', '১০০', '৪০']
    ]
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <div class="mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div class="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-700 p-8 text-white shadow-[0_30px_80px_-40px_rgba(30,41,59,0.8)] sm:p-12">
        <div class="grid gap-10 lg:grid-cols-[0.95fr_0.8fr] lg:items-center">
          <div class="space-y-6">
            <div class="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur-sm">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              আধুনিক ফলাফল প্ল্যাটফর্ম
            </div>
            <h1 class="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">Academic Result Studio</h1>
            <p class="max-w-2xl text-base leading-8 text-slate-200/90 sm:text-lg">একটি মসৃণ, সমসাময়িক ডিজাইন সহ একাডেমিক ফলাফল ব্যবস্থাপনা। বিষয়, ক্লাস, রেজাল্ট এবং প্রতিবেদন সহজ এবং সুন্দরভাবে সামলান।</p>
            <div class="flex flex-col gap-4 sm:flex-row">
              <button class="inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-500">শুরু করুন</button>
              <!-- <button class="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 px-6 py-3 text-base font-semibold text-white transition hover:bg-white/20">ডেমো দেখুন</button> -->
            </div>
            <!-- <div class="grid gap-4 sm:grid-cols-3">
              <div class="rounded-[1.75rem] bg-white/10 p-5">
                <p class="text-sm uppercase tracking-[0.24em] text-slate-300/90">ক্লাস</p>
                <p class="mt-4 text-3xl font-semibold text-white">{{ classCount }}</p>
              </div>
              <div class="rounded-[1.75rem] bg-white/10 p-5">
                <p class="text-sm uppercase tracking-[0.24em] text-slate-300/90">শিক্ষার্থী</p>
                <p class="mt-4 text-3xl font-semibold text-white">{{ studentCount }}</p>
              </div>
              <div class="rounded-[1.75rem] bg-white/10 p-5">
                <p class="text-sm uppercase tracking-[0.24em] text-slate-300/90">বিষয়</p>
                <p class="mt-4 text-3xl font-semibold text-white">{{ subjectCount }}</p>
              </div>
            </div> -->
          </div>

          <div class="rounded-[2rem] bg-slate-950/70 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur sm:p-8">
            <div class="mb-6 flex items-center justify-between gap-4 rounded-3xl bg-slate-900/80 p-4">
              <div>
                <p class="text-xs uppercase tracking-[0.28em] text-slate-400">Institution</p>
                <h2 class="mt-2 text-2xl font-semibold text-white">ABC উচ্চ বিদ্যালয়</h2>
              </div>
              <span class="rounded-full bg-emerald-500/10 px-3 py-2 text-sm font-semibold text-emerald-200">Active</span>
            </div>
            <div class="grid gap-4">
              <div class="rounded-3xl bg-slate-900/80 p-5">
                <p class="text-sm font-medium text-slate-400">প্রতিষ্ঠানের নাম</p>
                <p class="mt-2 text-lg font-semibold text-white">ABC উচ্চ বিদ্যালয়</p>
              </div>
              <div class="rounded-3xl bg-slate-900/80 p-5">
                <p class="text-sm font-medium text-slate-400">ইমেইল</p>
                <p class="mt-2 text-lg font-semibold text-white">abc@gmail.com</p>
              </div>
              <div class="rounded-3xl bg-slate-900/80 p-5">
                <p class="text-sm font-medium text-slate-400">সেশন</p>
                <p class="mt-2 text-lg font-semibold text-white">২০২৪-২০২৫</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section class="mt-10 grid gap-6">
        <div class="space-y-6">
          <AppCard title="Student Summary" subtitle="Key metrics">
            <div class="grid gap-4 md:grid-cols-3">
              <AppStat :label="'ক্লাস'" :value="classCount" description="পরিচালিত শ্রেণী" />
              <AppStat :label="'শিক্ষার্থী'" :value="studentCount" description="সক্রিয় রোল" />
              <AppStat :label="'বিষয়'" :value="subjectCount" description="নির্ধারিত বিষয়" />
            </div>
          </AppCard>

          <AppCard title="Latest Result" subtitle="Student performance">
            <AppTable :headers="tableHeaders" :rows="tableRows" />
          </AppCard>
        </div>

        <div class="space-y-6">
            <AppCard title="শ্রেণী বিশ্লেষণ" subtitle="">
                <AppTable :headers="classes.tableHeader" :rows="classes.loop" />
            </AppCard>
        </div>

        <div class="space-y-6">
          <AppToolbar :title="'Action Center'" :actions="actions" />

          <AppCard title="Contact" subtitle="Send update">
            <form class="space-y-4">
              <AppInputField label="নাম" placeholder="আপনার নাম লিখুন" />
              <AppInputField label="ইমেইল" type="email" modelValue="" placeholder="example@mail.com" />
              <AppInputField label="মোট ছাত্র" type="number" modelValue="" placeholder="১২৮" />
              <div class="flex items-center gap-3">
                <AppButton variant="primary" size="md">সাবমিট</AppButton>
                <AppButton variant="secondary" size="md">মুছুন</AppButton>
              </div>
            </form>
          </AppCard>

          <AppCard title="Empty State" subtitle="No data yet">
            <AppEmpty title="No reports yet" description="কোনো প্রতিবেদন তৈরি হয়নি। নতুন শুরু করতে বাটন টিপুন।" />
          </AppCard>
        </div>
      </section>
    </div>

    <!-- <AppModal title="Create New Report" :open="showModal" @close="showModal = false">
      <div class="grid gap-4 sm:grid-cols-2">
        <AppInputField label="রিপোর্টের নাম" placeholder="রিপোর্টের শিরোনাম" />
        <AppInputField label="স্টুডেন্ট সংখ্যা" type="number" placeholder="১২৮" />
      </div>
      <div class="mt-4 flex justify-end">
        <AppButton variant="primary" @click="showModal = false">Save Report</AppButton>
      </div>
    </AppModal> -->
  </div>
</template>

<style lang="postcss" scoped>
</style>
