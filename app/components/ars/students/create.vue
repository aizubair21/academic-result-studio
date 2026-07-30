<!--
Students Create Form — Create students for classes.
Supports multiple entries: form stays open after save.
-->
<script setup>
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
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <!-- Class Select -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5">ক্লাস <span class="text-red-500">*</span></label>
      <select
        v-model="form.classId"
        required
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
      >
        <option value="" disabled>ক্লাস নির্বাচন করুন</option>
        <option v-for="cls in classesData" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
      </select>
    </div>

    <div class="flex items-start gap-4 flex-col sm:flex-row">
      <!-- Student Name -->
      <div class="flex-1 w-full">
        <label class="block text-sm font-medium text-gray-700 mb-1.5">শিক্ষার্থীর নাম <span class="text-red-500">*</span></label>
        <input
          v-model="form.name"
          type="text"
          required
          placeholder="যেমন: রহিম মিয়া"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>

      <!-- Roll -->
      <div class="w-full sm:w-32">
        <label class="block text-sm font-medium text-gray-700 mb-1.5">রোল নম্বর <span class="text-red-500">*</span></label>
        <input
          v-model="form.roll"
          type="number"
          required
          placeholder="যেমন: 1"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      </div>
    </div>

    <!-- Success feedback -->
    <div
      v-if="justSaved"
      class="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      শিক্ষার্থী যুক্ত হয়েছে! আরও যোগ করুন অথবা নিচের "পরবর্তী ধাপ" বাটনে ক্লিক করুন।
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-2">
      <button
        type="submit"
        :disabled="ui.saving"
        class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
      >
        <svg v-if="ui.saving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        {{ ui.saving ? 'সংরক্ষণ হচ্ছে...' : 'শিক্ষার্থী যোগ করুন' }}
      </button>
    </div>
  </form>
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

