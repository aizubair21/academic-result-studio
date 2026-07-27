<script setup>
const ui = useUiStore();
const emit = defineEmits(['saved']);

const subjects = useSubjects();
const classesData = ref([]);

const form = reactive({
  classId: '',
  name: '',
  totalMark: '',
  passMark: '',
});

onMounted(async () => {
  const cls = useClasses();
  classesData.value = await cls.all();
});

async function handleSubmit() {
  if (!form.classId || !form.name.trim()) return;

  ui.saving = true;
  try {
    await subjects.create({
      classId: Number(form.classId),
      name: form.name.trim(),
      total_mark: form.totalMark ? Number(form.totalMark) : 100,
      pass_mark: form.passMark ? Number(form.passMark) : 33,
    });
    ui.showToast('success', 'বিষয় যুক্ত হয়েছে');
    emit('saved');
  } catch (err) {
    ui.showToast('error', 'বিষয় যুক্ত করতে সমস্যা হয়েছে: ' + err);
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

    <!-- Subject Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5">বিষয়ের নাম <span class="text-red-500">*</span></label>
      <input
        v-model="form.name"
        type="text"
        required
        placeholder="যেমন: গণিত"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
    </div>

    <!-- Total Mark -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5">মোট নম্বর</label>
      <input
        v-model="form.totalMark"
        type="number"
        placeholder="যেমন: 100"
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
    </div>

    <!-- Pass Mark -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1.5">পাস নম্বর</label>
      <input
        v-model="form.passMark"
        type="number"
        placeholder="যেমন: 33"
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

