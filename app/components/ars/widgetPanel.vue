<!--
Widget Panel — Onboarding workflow panel for the index page.
Handles step-by-step setup of institute, classes, subjects, and students.
Supports multiple entries per step with a "Next Step" button.
-->
<script setup>
const widget = useWidgetStore();
const ui = useUiStore();
const instituteRepo = useInstitute();

// Track if item was just created to show "Add Another" state
const lastCreated = ref(false);
const selectedStepDescription = ref('');

// Watch for step changes
watch(() => widget.workflow.current, (newStep) => {
  lastCreated.value = false;
  const step = widget.widgetSteps.find(s => s.widget === newStep);
  selectedStepDescription.value = step ? step.description : '';
});

// Handle saved event from sub-forms
const handleSaved = () => {
  lastCreated.value = true;
  ui.showToast('success', 'সফলভাবে সংরক্ষিত হয়েছে');
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

// Check if institute exists
const instituteExists = ref(false);
onMounted(async () => {
  instituteExists.value = await instituteRepo.exists();
});
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <!-- Dashboard View (all steps completed) -->
    <div v-if="widget.workflow.current === 'dashboard'" class="space-y-6">
      <!-- Dashboard Header -->
      <div class="text-center py-8">
        <div class="text-5xl mb-4">🎉</div>
        <h1 class="text-3xl font-bold text-slate-900 mb-2">সবকিছু প্রস্তুত!</h1>
        <p class="text-slate-500 text-lg">আপনার প্রতিষ্ঠানের ড্যাশবোর্ডে স্বাগতম। এখন আপনি রেজাল্ট ম্যানেজমেন্ট শুরু করতে প্রস্তুত।</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="text-2xl mb-2">🏫</div>
          <div class="text-sm font-medium text-slate-500">প্রতিষ্ঠান</div>
          <div class="text-lg font-bold text-slate-900">১টি যুক্ত</div>
        </div>
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="text-2xl mb-2">📚</div>
          <div class="text-sm font-medium text-slate-500">ক্লাস</div>
          <div class="text-lg font-bold text-slate-900">যুক্ত হয়েছে</div>
        </div>
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="text-2xl mb-2">📖</div>
          <div class="text-sm font-medium text-slate-500">বিষয়</div>
          <div class="text-lg font-bold text-slate-900">যুক্ত হয়েছে</div>
        </div>
        <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="text-2xl mb-2">👨‍🎓</div>
          <div class="text-sm font-medium text-slate-500">শিক্ষার্থী</div>
          <div class="text-lg font-bold text-slate-900">যুক্ত হয়েছে</div>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">দ্রুত নেভিগেশন</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <NuxtLink to="/institute" class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors group">
            <span class="text-xl">🏫</span>
            <div>
              <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-700">প্রতিষ্ঠান</div>
              <div class="text-xs text-slate-400">প্রতিষ্ঠানের তথ্য দেখুন</div>
            </div>
          </NuxtLink>
          <NuxtLink to="/classes" class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors group">
            <span class="text-xl">📚</span>
            <div>
              <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-700">ক্লাস</div>
              <div class="text-xs text-slate-400">ক্লাস পরিচালনা করুন</div>
            </div>
          </NuxtLink>
          <NuxtLink to="/subjects" class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors group">
            <span class="text-xl">📖</span>
            <div>
              <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-700">বিষয়</div>
              <div class="text-xs text-slate-400">বিষয় পরিচালনা করুন</div>
            </div>
          </NuxtLink>
          <NuxtLink to="/students" class="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-indigo-50 transition-colors group">
            <span class="text-xl">👨‍🎓</span>
            <div>
              <div class="text-sm font-medium text-slate-700 group-hover:text-indigo-700">শিক্ষার্থী</div>
              <div class="text-xs text-slate-400">শিক্ষার্থী পরিচালনা করুন</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Onboarding View -->
    <template v-else>
      <!-- Step Header -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
        <div class="flex items-center gap-4 mb-4">
          <div
            class="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
            :class="{
              'bg-emerald-100 text-emerald-600': widget.workflow.completed[currentStepInfo?.widget],
              'bg-indigo-100 text-indigo-600': !widget.workflow.completed[currentStepInfo?.widget],
            }"
          >
            {{ currentStepInfo?.icon }}
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold text-slate-900">
              {{ currentStepInfo?.name }} যোগ করুন
            </h2>
            <p class="text-sm text-slate-500 mt-0.5">
              {{ selectedStepDescription }}
            </p>
          </div>
          <div v-if="widget.workflow.completed[currentStepInfo?.widget]" class="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
            সম্পন্ন ✓
          </div>
        </div>

        <!-- Progress mini bar -->
        <div class="w-full bg-slate-100 rounded-full h-1.5">
          <div
            class="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
            :style="{ width: widget.progressPercent + '%' }"
          ></div>
        </div>
        <div class="mt-2 text-xs text-slate-400 text-right">
          {{ widget.completedStepCount }} / {{ widget.stepCount }} ধাপ সম্পন্ন
        </div>
      </div>

      <!-- Widget Form Box -->
      <div class="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <!-- Institute Create -->
        <ArsInstituteCreate
          v-if="widget.workflow.current == 'institute'"
          @saved="handleSaved"
        />

        <!-- Classes Create -->
        <ArsClassesCreate
          v-if="widget.workflow.current == 'classes'"
          @saved="handleSaved"
          :key="'classes-' + lastCreated"
        />

        <!-- Subjects Create -->
        <ArsSubjectsCreate
          v-if="widget.workflow.current == 'subjects'"
          @saved="handleSaved"
          :key="'subjects-' + lastCreated"
        />

        <!-- Students Create -->
        <ArsStudentsCreate
          v-if="widget.workflow.current == 'students'"
          @saved="handleSaved"
          :key="'students-' + lastCreated"
        />
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
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
          <button
            v-if="currentStepAllowsMultiple"
            type="button"
            @click="handleNextStep"
            class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            পরবর্তী ধাপ
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <!-- "Next Step" for single-entry (institute) — auto-advances via resolver -->
          <button
            v-if="!currentStepAllowsMultiple && widget.workflow.completed['institute']"
            type="button"
            @click="handleNextStep"
            class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all font-medium flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            পরবর্তী ধাপ
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
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

