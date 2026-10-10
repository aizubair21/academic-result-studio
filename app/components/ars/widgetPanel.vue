<script setup>
const widget = useWidgetStore();
const ui = useUiStore();
const instituteRepo = useInstitute();
const classesRepo = useClasses();
const subjectsRepo = useSubjects();
const studentsRepo = useStudents();
import { BarChart, BarChart2Icon, Barrel, Book, BookMarked, FileInput, Group, Home, HomeIcon, InspectionPanel, Layers, LucideBook, Users } from "@lucide/vue";

// Track if item was just created to show "Add Another" state
const lastCreated = ref(false);
const selectedStepDescription = ref('');
const workflowItems = ref([]);

const loadWorkflowItems = async () => {
  if (widget.workflow.current === 'classes') {
    workflowItems.value = (await classesRepo.all()).sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    return;
  }

  if (widget.workflow.current === 'subjects') {
    const [subjects, classes] = await Promise.all([subjectsRepo.all(), classesRepo.all()]);
    const classNames = new Map(classes.map(item => [item.id, item.name]));
    workflowItems.value = subjects.map(item => ({
      ...item,
      className: classNames.get(item.classId) || 'অজানা ক্লাস',
    }));
    return;
  }

  if (widget.workflow.current === 'students') {
    const [students, classes] = await Promise.all([studentsRepo.all(), classesRepo.all()]);
    const classNames = new Map(classes.map(item => [item.id, item.name]));
    workflowItems.value = students.map(item => ({
      ...item,
      className: classNames.get(item.classId) || 'অজানা ক্লাস',
    }));
    return;
  }

  workflowItems.value = [];
};

// Watch for step changes
watch(() => widget.workflow.current, (newStep) => {
  lastCreated.value = false;
  const step = widget.widgetSteps.find(s => s.widget === newStep);
  selectedStepDescription.value = step ? step.description : '';
  loadWorkflowItems();
});

// Handle saved event from sub-forms
const handleSaved = async () => {
  lastCreated.value = true;
  ui.showToast('success', 'সফলভাবে সংরক্ষিত হয়েছে');
  await loadWorkflowItems();
};

// Go to next workflow step
const handleNextStep = () => {
  widget.goToNextStep();
  lastCreated.value = false;
};

// Check if current step allows multiple entries
const currentStepAllowsMultiple = computed(() => {
  const step = widget.widgetSteps.find(s => s.widget === widget.workflow.current);
  return step ? step.allowMultiple : false;
});

// Get current step info
const currentStepInfo = computed(() => {
  return widget.widgetSteps.find(s => s.widget === widget.workflow.current);
});


// data information
const existedData = async() => {
  const cls = await classesRepo.count();
  const subj = await subjectsRepo.count();
  const std = await studentsRepo.count();
}

// Check if institute exists
const instituteExists = ref(false);
onMounted(async () => {
  instituteExists.value = await instituteRepo.exists();
  const step = widget.widgetSteps.find(s => s.widget === widget.workflow.current);
  selectedStepDescription.value = step ? step.description : '';
  await loadWorkflowItems();
});
</script>

<template>
  <div class="max-w-3xl mx-auto">


    <!-- Onboarding View -->
    <template v-if="widget.workflow.current != 'dashboard'">
      <!-- Step Header -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" :class="{
            'bg-emerald-100 text-emerald-600': widget.workflow.completed[currentStepInfo?.widget],
            'bg-indigo-100 text-indigo-600': !widget.workflow.completed[currentStepInfo?.widget],
          }">
            <component :is="currentStepInfo?.icon" class="flex items-center w-full mb-2" :size="17" />
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold text-slate-900">
              {{ currentStepInfo?.name }} যোগ করুন
            </h2>
            <p class="text-sm text-slate-500 mt-0.5">
              {{ selectedStepDescription }}
            </p>
          </div>
          <div v-if="widget.workflow.completed[currentStepInfo?.widget]"
            class="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
            সম্পন্ন ✓
          </div>
        </div>

        <!-- Progress mini bar -->
        <div class="w-full bg-slate-100 rounded-full h-1.5">
          <div class="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
            :style="{ width: widget.progressPercent + '%' }"></div>
        </div>
        <div class="mt-2 text-xs text-slate-400 text-right">
          {{ widget.completedStepCount }} / {{ widget.stepCount }} ধাপ সম্পন্ন
        </div>
      </div>

      <!-- Widget Form Box -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <!-- Institute Create -->
        <ArsInstituteCreate v-if="widget.workflow.current == 'institute'" @saved="handleSaved" />

        <!-- Classes Create -->
        <ArsClassesCreate v-if="widget.workflow.current == 'classes'" @saved="handleSaved"
          :key="'classes-' + lastCreated" />

        <!-- Subjects Create -->
        <ArsSubjectsCreate v-if="widget.workflow.current == 'subjects'" @saved="handleSaved"
          :key="'subjects-' + lastCreated" />

        <!-- Students Create -->
        <ArsStudentsCreate v-if="widget.workflow.current == 'students'" @saved="handleSaved"
          :key="'students-' + lastCreated" />
      </div>

      <div v-if="currentStepAllowsMultiple && workflowItems.length"
        class="mt-6 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-semibold text-slate-900">এখন পর্যন্ত যোগ করা তথ্য</h3>
          <span class="text-sm text-slate-500">{{ workflowItems.length }}টি</span>
        </div>
        <div class="divide-y divide-slate-100 max-h-72 overflow-y-auto">
          <div v-for="item in workflowItems" :key="item.id"
            class="px-6 py-3 flex items-center justify-between gap-4 text-sm">
            <div class="min-w-0">
              <p class="font-medium text-slate-800 truncate">
                {{ item.name }}
                <span v-if="widget.workflow.current === 'students'" class="font-normal text-slate-500">#{{ item.roll
                }}</span>
              </p>
              <p v-if="widget.workflow.current !== 'classes'" class="text-xs text-slate-500 mt-0.5">{{ item.className }}
              </p>
            </div>
            <span v-if="widget.workflow.current === 'classes' && item.index" class="text-xs text-slate-500">{{
              item.index }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div
        class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div class="text-sm text-slate-500">
          <template v-if="currentStepAllowsMultiple">
            <span v-if="lastCreated" class="text-emerald-600 font-medium">✓ আইটেম যুক্ত হয়েছে।</span>
            <span v-else>উপরের ফর্ম ব্যবহার করে তথ্য দিন।</span>
          </template>
          <template v-else>
            <span>প্রতিষ্ঠানের তথ্য দিন এবং সংরক্ষণ করুন।</span>
          </template>
        </div>

        <div class="flex items-center gap-3">
          <!-- "Next Step" button for multi-entry steps -->
          <AppButton v-if="currentStepAllowsMultiple" type="button" @click="handleNextStep" variant="primary">
            পরবর্তী ধাপ
            <!-- <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg> -->
          </AppButton>

          <!-- "Next Step" for single-entry (institute) — auto-advances via resolver -->
          <AppButton variant="primary" v-if="!currentStepAllowsMultiple && widget.workflow.completed['institute']" type="button"
            @click="handleNextStep">
            পরবর্তী ধাপ
            <!-- <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg> -->
          </AppButton>
        </div>
      </div>


    </template>
  </div>

</template>

<style scoped>
/* Smooth transitions for form changes */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.v-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.v-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
