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

onMounted(async () => {
  const cls = useClasses();
  const allClasses = await cls.all();
  classesData.value = [...allClasses].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
});

async function handleSubmit() {
  if (!form.classId || !form.name.trim() || !form.roll) return;

  ui.saving = true;
  try {
    await students.create({
      classId: Number(form.classId),
      name: form.name.trim(),
      roll: Number(form.roll),
    });
    ui.showToast('success', 'শিক্ষার্থী যুক্ত হয়েছে');
    emit('saved');
  } catch (err) {
    ui.showToast('error', 'শিক্ষার্থী যুক্ত করতে সমস্যা হয়েছে: ' + err);
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

    <!-- Student Name -->
    <div>
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
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5">রোল নম্বর <span class="text-red-500">*</span></label>
      <input
        v-model="form.roll"
        type="number"
        required
        placeholder="যেমন: 1"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
    </div>

    <!-- Actions -->
    <div class="flex gap-3 pt-2">
      <button
        type="submit"
        :disabled="ui.saving"
        class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all font-medium"
      >
        {{ ui.saving ? 'সেইভ হচ্ছে...' : 'সেইভ' }}
      </button>
    </div>
  </form>
</template>

