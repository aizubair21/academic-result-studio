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
      <div class="h-full overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-700 p-8 text-white shadow-[0_30px_80px_-40px_rgba(30,41,59,0.8)] sm:p-12">
        <div class="grid gap-10 lg:grid-cols-[0.95fr_0.8fr] lg:items-center">
          <div class="space-y-6">
            <div class="inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-200 backdrop-blur-sm">
              <span class="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              আধুনিক ফলাফল প্ল্যাটফর্ম
            </div>
            <h1 class="max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl"> রেজাল্ট স্টুডিও </h1>
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

    <!--   <section class="mt-10 grid gap-6">
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
      </section> -->
    </div>

    <AppModal title="Create New Report" :open="showModal" @close="showModal = false">
      <div class="grid gap-4 sm:grid-cols-2">
        <AppInputField label="রিপোর্টের নাম" placeholder="রিপোর্টের শিরোনাম" />
        <AppInputField label="স্টুডেন্ট সংখ্যা" type="number" placeholder="১২৮" />
      </div>
      <div class="mt-4 flex justify-end">
        <AppButton variant="primary" @click="showModal = false">Save Report</AppButton>
      </div>
    </AppModal>
  </div>
</template>

<style lang="postcss" scoped>
</style>











<!-- State 1: Empty Workspace -->
        <section v-if="step === 'empty'" class="flex h-full flex-col gap-6">
          <div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div class="mt-6 rounded-[1.5rem] bg-slate-50 p-6">
              <div class="text-sm font-semibold uppercase tracking-widest text-slate-500">Workflow</div>
              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center">①</div>
                  <div class="text-base font-semibold text-slate-800">Institution</div>
                </div>
                <div class="flex items-center gap-3 opacity-60">
                  <div class="h-9 w-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">②</div>
                  <div class="text-base font-semibold text-slate-800">Subjects</div>
                </div>
                <div class="flex items-center gap-3 opacity-60">
                  <div class="h-9 w-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">③</div>
                  <div class="text-base font-semibold text-slate-800">Students</div>
                </div>
                <div class="flex items-center gap-3 opacity-60">
                  <div class="h-9 w-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">④</div>
                  <div class="text-base font-semibold text-slate-800">Marks</div>
                </div>
                <div class="flex items-center gap-3 opacity-60">
                  <div class="h-9 w-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center">⑤</div>
                  <div class="text-base font-semibold text-slate-800">Reports</div>
                </div>
              </div>

              <div class="mt-6">
                <AppButton variant="primary" size="lg" @click="institutionModalOpen = true">
                  Add Institution
                </AppButton>
              </div>
            </div>
          </div>
        </section>

        <!-- State 2: Institution Ready -->
        <section v-else-if="step === 'institution'" class="flex flex-col gap-6">
          <AppCard>
            <template #default>
              <div class="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div class="text-sm font-semibold uppercase tracking-widest text-slate-500">Institution</div>
                  <div class="mt-2 text-3xl font-bold text-slate-900">{{ dummyInstitution.name }}</div>
                  <div class="mt-2 text-base font-medium text-slate-600">{{ dummyInstitution.location }} • {{ dummyInstitution.country }}</div>
                </div>
                <div>
                  <AppButton variant="secondary" size="md" @click="institutionModalOpen = true">Edit</AppButton>
                </div>
              </div>

              <div class="mt-6 grid gap-4 sm:grid-cols-3">
                <div class="rounded-[1.5rem] bg-white p-5 ring-1 ring-slate-200">
                  <div class="text-sm font-medium text-slate-500">Session</div>
                  <div class="mt-2 text-lg font-semibold text-slate-900">{{ dummyInstitution.session }}</div>
                </div>
                <div class="rounded-[1.5rem] bg-white p-5 ring-1 ring-slate-200">
                  <div class="text-sm font-medium text-slate-500">Email</div>
                  <div class="mt-2 text-lg font-semibold text-slate-900">{{ dummyInstitution.email }}</div>
                </div>
                <div class="rounded-[1.5rem] bg-white p-5 ring-1 ring-slate-200">
                  <div class="text-sm font-medium text-slate-500">Project State</div>
                  <div class="mt-2 text-lg font-semibold text-slate-900">{{ workspaceTitle }}</div>
                </div>
              </div>

              <div class="mt-6 flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">✓</div>
                <div>
                  <div class="text-sm font-semibold text-slate-500">Next Step</div>
                  <div class="text-lg font-semibold text-slate-900">Add Subjects</div>
                </div>
              </div>

              <div class="mt-6">
                <AppButton variant="primary" size="lg" @click="subjectsDrawerOpen = true">Add Subject</AppButton>
              </div>
            </template>
          </AppCard>
        </section>

        <!-- State 3: Subjects Ready -->
        <section v-else-if="step === 'subjects'" class="flex flex-col gap-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <div class="text-sm font-semibold uppercase tracking-widest text-slate-500">Subjects</div>
              <div class="mt-2 text-3xl font-bold text-slate-900">Select / Edit</div>
            </div>
            <AppButton variant="primary" size="md" @click="subjectsDrawerOpen = true">(+)</AppButton>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div
              v-for="s in subjectCards"
              :key="s"
              class="rounded-[2rem] bg-white p-6 ring-1 ring-slate-200 shadow-sm"
            >
              <div class="text-lg font-semibold text-slate-900">{{ s }}</div>
              <div class="mt-3 text-sm text-slate-600">UI-only card scaffold</div>
            </div>
            <button
              class="rounded-[2rem] bg-slate-50 p-6 ring-1 ring-slate-200 shadow-sm transition hover:bg-slate-100"
              @click="subjectsDrawerOpen = true"
            >
              <div class="text-2xl font-semibold text-indigo-600">(+)</div>
              <div class="mt-3 text-sm font-semibold text-slate-700">Add</div>
            </button>
          </div>
        </section>

        <!-- State 4: Students Ready -->
        <section v-else-if="step === 'students'" class="flex flex-col gap-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <div class="text-sm font-semibold uppercase tracking-widest text-slate-500">Students</div>
              <div class="mt-2 text-3xl font-bold text-slate-900">Manage Roster</div>
            </div>
            <AppButton variant="primary" size="lg" @click="studentsDrawerOpen = true">Add Student</AppButton>
          </div>

          <AppCard>
            <template #default>
              <div class="overflow-x-auto">
                <table class="min-w-full table-auto rounded-[2rem] border border-slate-200 bg-white">
                  <thead class="sticky top-0 bg-slate-50">
                    <tr>
                      <th class="px-5 py-4 text-left text-sm font-semibold text-slate-600">Roll</th>
                      <th class="px-5 py-4 text-left text-sm font-semibold text-slate-600">Name</th>
                      <th class="px-5 py-4 text-left text-sm font-semibold text-slate-600">Edit</th>
                      <th class="px-5 py-4 text-left text-sm font-semibold text-slate-600">Delete</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-200">
                    <tr v-for="st in dummyStudents" :key="st.roll" class="hover:bg-slate-50">
                      <td class="px-5 py-4 text-sm font-medium text-slate-700">{{ st.roll }}</td>
                      <td class="px-5 py-4 text-sm text-slate-800">{{ st.name }}</td>
                      <td class="px-5 py-4">
                        <button class="rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700">Edit</button>
                      </td>
                      <td class="px-5 py-4">
                        <button class="rounded-xl bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-700">Delete</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="mt-6 flex items-center gap-4">
                <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-700">✓</div>
                <div>
                  <div class="text-sm font-semibold text-slate-500">Next Step</div>
                  <div class="text-lg font-semibold text-slate-900">Enter Marks</div>
                </div>
                <div class="ml-auto">
                  <AppButton variant="primary" size="md" @click="step = 'marks'">Go to Marks</AppButton>
                </div>
              </div>
            </template>
          </AppCard>
        </section>

        <!-- State 5: Marks Entry -->
        <section v-else-if="step === 'marks'" class="flex flex-col gap-6">
          <div class="flex items-center justify-between gap-4">
            <div>
              <div class="text-sm font-semibold uppercase tracking-widest text-slate-500">Marks Entry</div>
              <div class="mt-2 text-3xl font-bold text-slate-900">Excel-like Workspace</div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <AppButton variant="primary" size="md" @click="generateResultNow">Generate Result</AppButton>
              <AppButton variant="secondary" size="md" @click="() => {}">Save</AppButton>
            </div>
          </div>

          <div class="rounded-[2rem] bg-white p-4 ring-1 ring-slate-200">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div class="flex flex-wrap items-center gap-3">
                <div class="rounded-2xl bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700">Search Student</div>
                <div class="rounded-2xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">UI-only</div>
              </div>
              <div class="flex items-center gap-3 text-sm font-semibold text-slate-600">
                <span class="rounded-2xl bg-emerald-500/10 px-3 py-2 text-emerald-700">Enter</span>
                <span class="rounded-2xl bg-emerald-500/10 px-3 py-2 text-emerald-700">Tab</span>
                <span class="rounded-2xl bg-emerald-500/10 px-3 py-2 text-emerald-700">Arrow Keys</span>
              </div>
            </div>
          </div>

          <div class="overflow-hidden rounded-[2rem] bg-white ring-1 ring-slate-200">
            <table class="min-w-full border-collapse text-left text-sm">
              <thead class="sticky top-0 bg-slate-50">
                <tr>
                  <th
                    v-for="h in marksTableHeaders"
                    :key="h"
                    class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600"
                  >
                    {{ h }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, rIdx) in tableRowsMarks"
                  :key="rIdx"
                  class="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td v-for="(cell, cIdx) in row" :key="cIdx" class="px-5 py-4 text-slate-700">
                    <span v-if="cIdx < 2" class="font-semibold text-slate-800">{{ cell }}</span>
                    <span v-else-if="cIdx === row.length - 2">{{ cell }}</span>
                    <span
                      v-else-if="cIdx === row.length - 1"
                      class="inline-flex items-center rounded-xl px-3 py-1 text-xs font-bold"
                      :class="cell === 'Pass' ? 'bg-emerald-500/10 text-emerald-700' : 'bg-red-500/10 text-red-700'"
                    >
                      {{ cell }}
                    </span>
                    <input
                      v-else
                      class="w-20 rounded-xl border border-slate-200 bg-white px-2 py-2 text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      :value="cell"
                      @input="() => {}"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- State 6: Report Mode -->
        <section v-else class="flex flex-col gap-6">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div class="text-sm font-semibold uppercase tracking-widest text-slate-500">Report Mode</div>
              <div class="mt-2 text-3xl font-bold text-slate-900">Printable Results</div>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <AppButton variant="secondary" size="md" @click="printNow">Print</AppButton>
              <AppButton variant="primary" size="md" @click="exportNow">Export</AppButton>
              <AppButton variant="secondary" size="md" @click="step = 'marks'">Back to Marks</AppButton>
            </div>
          </div>

          <div class="rounded-[2rem] bg-white p-4 ring-1 ring-slate-200">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="t in [
                  { key: 'class', label: 'Class Result' },
                  { key: 'subject', label: 'Subject Result' },
                  { key: 'student', label: 'Student Result' },
                  { key: 'stats', label: 'Statistics' },
                ]"
                :key="t.key"
                class="rounded-2xl px-4 py-2 text-sm font-semibold transition"
                :class="reportTab === t.key ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-50 text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100'"
                @click="reportTab = t.key as any"
              >
                {{ t.label }}
              </button>
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-[2rem] bg-white p-6 ring-1 ring-slate-200 shadow-sm">
              <div class="text-sm font-semibold text-slate-500">Pass</div>
              <div class="mt-2 text-3xl font-bold text-emerald-700">3</div>
            </div>
            <div class="rounded-[2rem] bg-white p-6 ring-1 ring-slate-200 shadow-sm">
              <div class="text-sm font-semibold text-slate-500">Fail</div>
              <div class="mt-2 text-3xl font-bold text-red-700">1</div>
            </div>
            <div class="rounded-[2rem] bg-white p-6 ring-1 ring-slate-200 shadow-sm">
              <div class="text-sm font-semibold text-slate-500">Highest</div>
              <div class="mt-2 text-3xl font-bold text-indigo-700">450</div>
            </div>
            <div class="rounded-[2rem] bg-white p-6 ring-1 ring-slate-200 shadow-sm">
              <div class="text-sm font-semibold text-slate-500">Lowest</div>
              <div class="mt-2 text-3xl font-bold text-orange-700">392</div>
            </div>
          </div>

          <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <AppCard>
              <template #default>
                <div class="flex items-center justify-between gap-3">
                  <div>
                    <div class="text-sm font-semibold uppercase tracking-widest text-slate-500">{{ reportTab === 'class' ? 'Class Result' : 'Result Table' }}</div>
                    <div class="mt-2 text-lg font-bold text-slate-900">UI-only table scaffold</div>
                  </div>
                  <div class="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">{{ reportTab }}</div>
                </div>

                <div class="mt-4">
                  <AppTable :headers="['Roll', 'Name', 'Total', 'Status']" :rows="[
                    ['1', 'রাফি হাসান', '450', 'Pass'],
                    ['2', 'সাবিনা সুলতানা', '420', 'Pass'],
                    ['3', 'মাহিনুর রহমান', '392', 'Fail'],
                    ['4', 'সোহেল রানা', '430', 'Pass'],
                  ]" />
                </div>
              </template>
            </AppCard>

            <AppCard>
              <template #default>
                <div class="text-sm font-semibold uppercase tracking-widest text-slate-500">Merit Table</div>
                <div class="mt-2 text-lg font-bold text-slate-900">Top performers (dummy)</div>
                <div class="mt-4 space-y-3">
                  <div v-for="i in 5" :key="i" class="flex items-center justify-between rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <div class="flex items-center gap-3">
                      <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white text-xs font-bold">{{ i }}</div>
                      <div class="text-sm font-semibold text-slate-800">শিক্ষার্থী {{ i }}</div>
                    </div>
                    <div class="text-sm font-bold text-slate-700">{{ 500 - i * 10 }}</div>
                  </div>
                </div>
              </template>
            </AppCard>
          </div>
        </section>