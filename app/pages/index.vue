<script lang="ts" setup>
// import { ChevronRight, Download, Printer, Redo2, Settings, Save, RotateCcw, Undo, Upload } from 'lucide-vue-next'
type WorkspaceStep = 'empty' | 'institution' | 'classes' | 'subjects' | 'students' | 'marks' | 'reports'

const step = ref<WorkspaceStep>('empty')


const workspaceTitle = computed(() => {
  switch (step.value) {
    case 'empty':
      return 'Empty'
    case 'institution':
      return 'Institution Ready'
    case 'classes':
      return 'Class Ready'
    case 'subjects':
      return 'Subjects Ready'
    case 'students':
      return 'Students Ready'
    case 'marks':
      return 'Marks Entry'
    case 'reports':
      return 'Report Mode'
  }
})

const projectName = 'ABC School'

const readiness = computed(() => {
  return {
    institutionReady: ['institution', 'classes', 'subjects', 'students', 'marks', 'reports'].includes(step.value),
    classReady: ['classes', 'subjects', 'students', 'marks', 'reports'].includes(step.value),
    subjectsReady: ['subjects', 'students', 'marks', 'reports'].includes(step.value),
    studentsReady: ['students', 'marks', 'reports'].includes(step.value),
    marksReady: ['marks', 'reports'].includes(step.value),
    reportsReady: ['reports'].includes(step.value),
  }
})

const navItems = [
  { key: 'institution', label: '🏫 Institution', icon: '🏫' },
  { key: 'classes', label: ' 📚 Classes', 'icon': '📚'},
  { key: 'subjects', label: '📚 Subjects', icon: '📚' },
  { key: 'students', label: '👨‍🎓 Students', icon: '👨‍🎓' },
  { key: 'marks', label: '📝 Marks', icon: '📝' },
  { key: 'reports', label: '📄 Reports', icon: '📄' },
  { key: 'settings', label: '⚙ Settings', icon: '⚙️' },
] as const

const activeNavKey = computed(() => {
  switch (step.value) {
    case 'empty':
      return 'institution'
    case 'institution':
      return 'institution'
    case 'classes':
      return 'classes'
    case 'subjects':
      return 'subjects'
    case 'students':
      return 'students'
    case 'marks':
      return 'marks'
    case 'reports':
      return 'reports'
  }
})

const canNavigateTo = (key: string) => {
  if (key === 'institution') return true
  if (key === 'classes') return readiness.value.classReady
  if (key === 'subjects') return readiness.value.institutionReady
  if (key === 'students') return readiness.value.subjectsReady
  if (key === 'marks') return readiness.value.studentsReady
  if (key === 'reports') return readiness.value.marksReady
  if (key === 'settings') return true
  return false
}

const navigate = (key: string) => {
  if (!canNavigateTo(key)) return
  switch (key) {
    case 'institution':
      step.value = readiness.value.institutionReady ? 'institution' : 'empty'
      break
    case 'classes':
      step.value = 'classes'
      break
    case 'subjects':
      step.value = 'subjects'
      break
    case 'students':
      step.value = 'students'
      break
    case 'marks':
      step.value = 'marks'
      break
    case 'reports':
      step.value = 'reports'
      break
    case 'settings':
      settingsOpen.value = true
      break
  }
}

// Modals/Drawers (UI-only)
const institutionModalOpen = ref(false)
const settingsOpen = ref(false)

const subjectsDrawerOpen = ref(false)
const studentsDrawerOpen = ref(false)

const dummyInstitution = {
  name: 'ABC High School',
  location: 'Dhaka',
  country: 'Bangladesh',
  session: '২০২৪-২০২৫',
  email: 'abc@gmail.com',
}

const dummyClasses = 
[
    { name: 'Play', order:1 },
    { name: 'Nursery', order:2 }
]

const subjectCards = 
[ 
    { name: 'বাংলা', classId:1 },
    { name: 'ইংরেজী', classId: 1 },
    { name: 'গনিত', classId:2},

]

type StudentRow = {
  roll: string
  name: string
  classId: BigInteger
}

const dummyStudents = ref<StudentRow[]>([
  { roll: '1', name: 'রাফি হাসান', classId:1 },
  { roll: '2', name: 'সাবিনা সুলতানা', classId:1 },
  { roll: '3', name: 'মাহিনুর রহমান', classId:2 },
])

const marksSubjects = computed(() => {
  return ['বাংলা', 'ইংরেজি', 'গণিত', 'বিজ্ঞান', 'আইসিটি']
})

const marksTableHeaders = computed(() => {
  return ['Roll', 'Name', ...marksSubjects.value, 'Total', 'Status']
})

const marksRows = computed(() => {
  // UI-only dummy rows
  return dummyStudents.value.map((s, idx) => {
    const subjectMarks = marksSubjects.value.map((_, j) => `${80 + idx * 3 + j * 2}`)
    const total = subjectMarks.map(Number).reduce((a, b) => a + b, 0)
    return {
      row: [s.roll, s.name, ...subjectMarks, String(total), idx % 2 === 0 ? 'Pass' : 'Fail'],
    }
  })
})

const tableRowsMarks = computed(() => marksRows.value.map((r) => r.row))

const versionText = 'v1.0'
const databaseStatusText = 'Ready'
const autoSaveText = computed(() => {
  return readiness.value.marksReady || readiness.value.reportsReady ? 'Auto Save ✓' : 'Auto Save —'
})

const rightAssistant = computed(() => {
  if (step.value === 'empty') {
    return {
      title: 'Next Step',
      nextStepTitle: 'Add Institution',
      ctaLabel: 'Add Institution',
      tips: ['Ctrl + S', 'Auto Save (dummy) Enabled'],
      progress: [
        { label: 'Institution', done: false },
        { label: 'Classes', done: false },
        { label: 'Subjects', done: false },
        { label: 'Students', done: false },
        { label: 'Marks', done: false },
        { label: 'Reports', done: false },
      ],
    }
  }

  if (step.value === 'institution') {
    return {
      title: 'Next Step',
      nextStepTitle: 'Add Classes',
      ctaLabel: 'Add Classes',
      tips: ['Ctrl + S', 'Auto Save Enabled'],
      progress: [
        { label: 'Institution', done: true },
        { label: 'Classes', done: true },
        { label: 'Subjects', done: false },
        { label: 'Students', done: false },
        { label: 'Marks', done: false },
        { label: 'Reports', done: false },
      ],
    }
  }

  if (step.value === 'classes') {
    return {
      title: 'Next Step',
      nextStepTitle: 'Add Subjects',
      ctaLabel: 'Add Subject',
      tips: ['Ctrl + S', 'Auto Save Enabled'],
      progress: [
        { label: 'Institution', done: true },
        { label: 'Classes', done: true },
        { label: 'Subjects', done: false },
        { label: 'Students', done: false },
        { label: 'Marks', done: false },
        { label: 'Reports', done: false },
      ],
    }
  }

  if (step.value === 'subjects') {
    return {
      title: 'Next Step',
      nextStepTitle: 'Add Students',
      ctaLabel: 'Add Student',
      tips: ['Ctrl + S', 'Auto Save Enabled'],
      progress: [
        { label: 'Institution', done: true },
        { label: 'Classes', done: true },
        { label: 'Subjects', done: true },
        { label: 'Students', done: false },
        { label: 'Marks', done: false },
        { label: 'Reports', done: false },
      ],
    }
  }

  if (step.value === 'students') {
    return {
      title: 'Next Step',
      nextStepTitle: 'Enter Marks',
      ctaLabel: 'Go to Marks',
      tips: ['Enter / Tab', 'Arrow Keys', 'Sticky header enabled'],
      progress: [
        { label: 'Institution', done: true },
        { label: 'Classes', done: true },
        { label: 'Subjects', done: true },
        { label: 'Students', done: true },
        { label: 'Marks', done: false },
        { label: 'Reports', done: false },
      ],
    }
  }

  if (step.value === 'marks') {
    return {
      title: 'Next Step',
      nextStepTitle: 'Generate Reports',
      ctaLabel: 'Open Reports',
      tips: ['Ctrl + S', 'Generate Result (UI only)'],
      progress: [
        { label: 'Institution', done: true },
        { label: 'Classes', done: true },
        { label: 'Subjects', done: true },
        { label: 'Students', done: true },
        { label: 'Marks', done: true },
        { label: 'Reports', done: false },
      ],
    }
  }

  return {
    title: 'Next Step',
    nextStepTitle: 'Print / Export',
    ctaLabel: 'Print',
    tips: ['Print', 'Export (UI only)'],
    progress: [
      { label: 'Institution', done: true },
      { label: 'Classes', done: true },
      { label: 'Subjects', done: true },
      { label: 'Students', done: true },
      { label: 'Marks', done: true },
      { label: 'Reports', done: true },
    ],
  }
})

// Report tabs (UI-only)
const reportTab = ref<'class' | 'subject' | 'student' | 'stats'>('class')

const setStepFromAssistantCTA = () => {
  if (step.value === 'empty') {
    institutionModalOpen.value = true
    return
  }
//   if (step.value === 'institution') {
//     classDrawerdoOpen.value = true
//     return
//   }
  if (step.value === 'classes') {
    subjectsDrawerOpen.value = true
    return
  }
  if (step.value === 'subjects') {
    studentsDrawerOpen.value = true
    return
  }
  if (step.value === 'students') {
    step.value = 'marks'
    return
  }
  if (step.value === 'marks') {
    step.value = 'reports'
    return
  }
}

const printNow = () => {
  window.print()
}

const exportNow = () => {
  // UI only
  alert('Export (UI only)')
}

const generateResultNow = () => {
  // UI only; jump to reports
  step.value = 'reports'
}

// Fake editable drawer content
const tempInstitutionName = ref(dummyInstitution.name)
const tempEmail = ref(dummyInstitution.email)
const tempSession = ref(dummyInstitution.session)

const saveInstitution = () => {
  institutionModalOpen.value = false
  step.value = 'institution'
}

const closeDrawer = (which: 'subjects' | 'students') => {
  if (which === 'subjects') subjectsDrawerOpen.value = false
  if (which === 'students') studentsDrawerOpen.value = false
}

const saveSubjects = () => {
  closeDrawer('subjects')
  step.value = 'subjects'
}

const saveStudents = () => {
  closeDrawer('students')
  step.value = 'students'
}

const addStudentDummy = () => {
  dummyStudents.value = [
    ...dummyStudents.value,
    { roll: String(dummyStudents.value.length + 1), name: `শিক্ষার্থী ${dummyStudents.value.length + 1}` },
  ]
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 font-sans">
    <!-- Top Application Bar -->
    <header class="sticky top-0 z-40 h-[72px] border-b border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex h-full max-w-[1440px] items-center justify-between px-4">
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm">
            🎓
          </div>
          <div>
            <div class="text-base font-semibold text-slate-900">Academic Result Studio</div>
            <div class="text-xs font-medium text-slate-500">{{ projectName }}</div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl transition hover:bg-slate-100"
            title="Undo"
            aria-label="Undo"
            @click="() => {}"
          >
            <Undo :size="18" class="text-slate-700" />
          </button>
          <button
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl transition hover:bg-slate-100"
            title="Redo"
            aria-label="Redo"
            @click="() => {}"
          >
            <Redo2 :size="18" class="text-slate-700" />
          </button>

          <div class="h-10 w-px bg-slate-200" />

          <AppButton variant="primary" size="md" type="button" title="Save" @click="() => {}">
            <span class="flex items-center gap-2">
              <Save :size="18" />
              Save
            </span>
          </AppButton>

          <button
            class="inline-flex h-10 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            @click="exportNow"
          >
            <Download :size="18" />
            Export
          </button>

          <button
            class="inline-flex h-10 items-center gap-2 rounded-2xl bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            @click="printNow"
          >
            <Printer :size="18" />
            Print
          </button>

          <button
            class="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
            title="Settings"
            aria-label="Settings"
            @click="settingsOpen = true"
          >
            <Settings :size="18" class="text-slate-700" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main layout regions -->
    <div class="mx-auto grid max-w-[1440px] grid-cols-[72px_1fr_320px] gap-0 px-0 pt-0">
      <!-- Left Workspace Navigator -->
      <nav class="hidden border-r border-slate-200 md:block" aria-label="Workspace navigation">
        <div class="flex h-[calc(100vh-108px)] flex-col items-center gap-3 py-4">
          <button
            v-for="item in navItems"
            :key="item.key"
            class="relative flex h-12 w-12 items-center justify-center rounded-2xl transition"
            :class="{
              'bg-indigo-600 text-white shadow-sm': item.key === activeNavKey && canNavigateTo(item.key),
              'text-slate-700 hover:bg-slate-100': item.key !== activeNavKey,
              'opacity-40 cursor-not-allowed hover:bg-transparent': !canNavigateTo(item.key),
            }"
            :disabled="!canNavigateTo(item.key)"
            @click="navigate(item.key)"
          >
            <span class="text-lg">{{ item.icon }}</span>
            <span
              class="pointer-events-none absolute left-[82px] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block"
            >
              {{ item.label.replace(/^[^\w]+\s*/, '') }}
            </span>
          </button>
        </div>
      </nav>

      <!-- Main Workspace -->
      <main class="min-h-[calc(100vh-108px)] px-4 pb-4 pt-4 md:px-6">
        <!-- State 1: Empty Workspace -->
        <section v-if="step === 'empty'" class="flex h-full flex-col gap-6">
          <div class="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div class="flex flex-col gap-3">
              <div class="text-3xl font-bold text-slate-900">স্বাগতম</div>
              <div class="text-2xl font-semibold text-slate-800">Academic Result Studio</div>
              <p class="max-w-2xl text-base text-slate-600">
                এই প্রকল্পটি বর্তমানে খালি। নিচের ওয়ার্কফ্লো অনুযায়ী প্রতিষ্ঠান যোগ দিয়ে শুরু করুন।
              </p>
            </div>

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
      </main>

      <!-- Right Context Assistant -->
      <aside class="hidden border-l border-slate-200 bg-white md:block">
        <div class="flex h-[calc(100vh-108px)] flex-col">
          <div class="p-4">
            <div class="rounded-[2rem] bg-slate-50 p-5 ring-1 ring-slate-200">
              <div class="text-sm font-semibold uppercase tracking-widest text-slate-500">{{ rightAssistant.title }}</div>
              <div class="mt-2 text-lg font-bold text-slate-900">{{ rightAssistant.nextStepTitle }}</div>

              <div class="mt-5">
                <AppButton variant="primary" size="lg" class="w-full" @click="setStepFromAssistantCTA">{{ rightAssistant.ctaLabel }}</AppButton>
              </div>

              <div class="mt-6 rounded-[1.5rem] bg-white p-4 ring-1 ring-slate-200">
                <div class="text-sm font-semibold text-slate-700">Tips</div>
                <div class="mt-2 space-y-2">
                  <div v-for="t in rightAssistant.tips" :key="t" class="text-sm font-semibold text-slate-600">
                    • {{ t }}
                  </div>
                </div>
              </div>

              <div class="mt-6">
                <div class="text-sm font-semibold text-slate-700">Project Progress</div>
                <div class="mt-3 space-y-2">
                  <div v-for="p in rightAssistant.progress" :key="p.label" class="flex items-center justify-between rounded-2xl bg-white p-3 ring-1 ring-slate-200">
                    <div class="text-sm font-semibold text-slate-700">{{ p.label }}</div>
                    <div
                      class="text-xs font-bold"
                      :class="p.done ? 'text-emerald-700' : 'text-slate-400'"
                    >
                      {{ p.done ? '✓' : '○' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-auto p-4">
            <div class="rounded-[2rem] bg-gradient-to-br from-blue-600/10 to-indigo-600/10 p-4 ring-1 ring-blue-600/10">
              <div class="text-sm font-semibold text-slate-700">Current mode</div>
              <div class="mt-1 text-lg font-bold text-slate-900">{{ workspaceTitle }}</div>
              <div class="mt-2 text-sm font-medium text-slate-600">UI-only workflow state</div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- Bottom Status Bar -->
    <footer class="sticky bottom-0 z-40 border-t border-slate-200 bg-white/90 backdrop-blur">
      <div class="mx-auto flex h-[36px] max-w-[1440px] items-center justify-between px-4 text-xs font-semibold text-slate-600">
        <div>{{ autoSaveText }}</div>
        <div>{{ projectName }}</div>
        <div class="flex items-center gap-3">
          <span>IndexedDB {{ databaseStatusText }}</span>
          <span class="hidden md:inline">•</span>
          <span class="hidden md:inline">{{ versionText }}</span>
        </div>
      </div>
    </footer>

    <!-- Institution Modal -->
    <AppModal title="Institution" :open="institutionModalOpen" @close="institutionModalOpen = false">
      <div class="space-y-4">
        <AppInputField label="Institution Name" placeholder="ABC High School" v-model="tempInstitutionName" />
        <AppInputField label="Email" placeholder="abc@gmail.com" type="email" v-model="tempEmail" />
        <AppInputField label="Session" placeholder="২০২৪-২০২৫" v-model="tempSession" />
        <div class="flex justify-end gap-3">
          <AppButton variant="secondary" size="md" @click="institutionModalOpen = false">Cancel</AppButton>
          <AppButton variant="primary" size="md" @click="saveInstitution">Save</AppButton>
        </div>
      </div>
    </AppModal>

    <!-- Settings Modal -->
    <AppModal title="Settings" :open="settingsOpen" @close="settingsOpen = false">
      <div class="space-y-4">
        <AppCard>
          <template #default>
            <div class="space-y-2">
              <div class="text-sm font-semibold text-slate-700">UI-only settings</div>
              <div class="text-sm text-slate-600">No persistence/business logic implemented.</div>
            </div>
          </template>
        </AppCard>
        <div class="flex justify-end">
          <AppButton variant="primary" size="md" @click="settingsOpen = false">Done</AppButton>
        </div>
      </div>
    </AppModal>

    <!-- Subjects Drawer (UI-only) -->
    <div
      v-if="subjectsDrawerOpen"
      class="fixed inset-0 z-50 flex"
      aria-modal="true"
      role="dialog"
    >
      <div class="flex-1 bg-slate-950/40" @click="subjectsDrawerOpen = false" />
      <div class="w-full max-w-md bg-white p-4 shadow-2xl ring-1 ring-slate-200">
        <div class="flex items-center justify-between gap-3 rounded-[2rem] bg-slate-50 p-4 ring-1 ring-slate-200">
          <div>
            <div class="text-sm font-semibold uppercase tracking-widest text-slate-500">Subjects</div>
            <div class="mt-1 text-lg font-bold text-slate-900">Quick Editing</div>
          </div>
          <button class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700" @click="subjectsDrawerOpen = false">Close</button>
        </div>

        <div class="mt-4 space-y-4">
          <div class="rounded-[2rem] bg-white p-4 ring-1 ring-slate-200">
            <div class="text-sm font-semibold text-slate-700">Add / Edit subjects (dummy)</div>
            <div class="mt-3 flex flex-wrap gap-2">
              <button v-for="s in ['বাংলা', 'ইংরেজি', 'গণিত', 'বিজ্ঞান', 'আইসিটি', 'কর্মকৌশল']" :key="s" class="rounded-2xl bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">{{ s }}</button>
            </div>
          </div>

          <div class="flex justify-end">
            <AppButton variant="primary" size="lg" @click="saveSubjects">Save Subjects</AppButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Students Drawer (UI-only) -->
    <div
      v-if="studentsDrawerOpen"
      class="fixed inset-0 z-50 flex"
      aria-modal="true"
      role="dialog"
    >
      <div class="flex-1 bg-slate-950/40" @click="studentsDrawerOpen = false" />
      <div class="w-full max-w-md bg-white p-4 shadow-2xl ring-1 ring-slate-200">
        <div class="flex items-center justify-between gap-3 rounded-[2rem] bg-slate-50 p-4 ring-1 ring-slate-200">
          <div>
            <div class="text-sm font-semibold uppercase tracking-widest text-slate-500">Students</div>
            <div class="mt-1 text-lg font-bold text-slate-900">Quick Editing</div>
          </div>
          <button class="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700" @click="studentsDrawerOpen = false">Close</button>
        </div>

        <div class="mt-4 space-y-4">
          <div class="rounded-[2rem] bg-white p-4 ring-1 ring-slate-200">
            <div class="flex items-center justify-between gap-3">
              <div class="text-sm font-semibold text-slate-700">Roster (dummy)</div>
              <AppButton variant="secondary" size="md" @click="addStudentDummy">Add</AppButton>
            </div>
            <div class="mt-3 space-y-2">
              <div v-for="st in dummyStudents" :key="st.roll" class="flex items-center justify-between rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                <div class="text-sm font-semibold text-slate-800">{{ st.roll }}. {{ st.name }}</div>
                <button class="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">Edit</button>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <AppButton variant="primary" size="lg" @click="saveStudents">Save Students</AppButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
/* Keep styles minimal: Tailwind drives the design */
</style>

