<script setup>
const ui = useUiStore();
const widgetStore = useWidgetStore();
const classes = useClasses();

const emit = defineEmits(['saved']);

const form = reactive({
  name: '',
  index: '',
});

// Success state for showing feedback
const justSaved = ref(false);
let successTimeout = null;

const handleSubmit = async () => {
  if (!form.name.trim()) return;

  ui.saving = true;
  try {
    const data = {
      name: form.name.trim(),
      index: form.index ? Number(form.index) : undefined,
    };

    await classes.create(data);

    // Show success feedback
    justSaved.value = true
    if (successTimeout) clearTimeout(successTimeout);
    successTimeout = setTimeout(() => {
      justSaved.value = false;
    }, 3000);

    // Reset form for next entry
    form.name = '';
    form.index = '';

    ui.showToast('success', `"${data.name}" ক্লাস যুক্ত হয়েছে`);

    emit('saved');
  } catch (error) {
    ui.showToast('error', 'ক্লাস যুক্ত করতে সমস্যা হয়েছে: ' + (error.message || error));
  } finally {
    ui.saving = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="flex items-start gap-4 flex-col sm:flex-row">
      <div class="flex-1 w-full">
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          ক্লাসের নাম <span class="text-red-500">*</span>
        </label>
        <input v-model="form.name" type="text" required placeholder="যেমন: নবম"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
      </div>
      <div class="w-full sm:w-32">
        <label class="block text-sm font-medium text-gray-700 mb-1.5">
          ইনডেক্স
        </label>
        <input v-model="form.index" type="number" placeholder="যেমন: 9"
          class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
      </div>
    </div>

    <!-- Success feedback -->
    <div v-if="justSaved && !ui.sidebarOpen"
      class="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      ক্লাস যুক্ত হয়েছে! আরও যোগ করুন অথবা নিচের "পরবর্তী ধাপ" বাটনে ক্লিক করুন।
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-2">
      <AppButton variant="primary" type="submit"
        class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2">
        {{ ui.saving ? 'সংরক্ষণ হচ্ছে...' : 'ক্লাস যোগ করুন' }}
      </AppButton>
    </div>
  </form>
</template>

<style scoped>
/* Smooth transition for success message */
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
