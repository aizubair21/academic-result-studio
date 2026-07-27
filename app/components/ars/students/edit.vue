<script setup>
const props = defineProps({
  data: { type: Object, required: true }
});

const emit = defineEmits(['saved', 'cancel']);

const ui = useUiStore();
const classesData = ref([]);

const form = reactive({
  classId: props.data.classId || '',
  name: props.data.name || '',
  roll: props.data.roll || '',
});

onMounted(async () => {
  const cls = useClasses();
  const allClasses = await cls.all();
  classesData.value = [...allClasses].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
});

async function handleSubmit() {
  ui.saving = true;
  try {
    const students = useStudents();
    await students.update(props.data.id, {
      classId: Number(form.classId),
      name: form.name.trim(),
      roll: Number(form.roll),
    });
    ui.showToast('success', 'শিক্ষার্থী আপডেট হয়েছে');
    emit('saved');
  } catch (err) {
    ui.showToast('error', 'আপডেট করতে সমস্যা হয়েছে: ' + err);
  } finally {
    ui.saving = false;
  }
}

function handleCancel() {
  emit('cancel');
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-3">
    <!-- Class Select -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">ক্লাস <span class="text-red-500">*</span></label>
      <select
        v-model="form.classId"
        required
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-sm"
      >
        <option value="" disabled>ক্লাস নির্বাচন করুন</option>
        <option v-for="cls in classesData" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
      </select>
    </div>

    <!-- Student Name -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">শিক্ষার্থীর নাম <span class="text-red-500">*</span></label>
      <input
        v-model="form.name"
        type="text"
        required
        placeholder="যেমন: রহিম মিয়া"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
      />
    </div>

    <!-- Roll -->
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">রোল নম্বর <span class="text-red-500">*</span></label>
      <input
        v-model="form.roll"
        type="number"
        required
        placeholder="যেমন: 1"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
      />
    </div>

    <!-- Actions -->
    <div class="flex gap-2 pt-1">
      <button
        type="submit"
        :disabled="ui.saving"
        class="px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition"
      >
        {{ ui.saving ? 'সেইভ হচ্ছে...' : 'সেইভ' }}
      </button>
      <button
        type="button"
        @click="handleCancel"
        class="px-4 py-1.5 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 text-sm font-medium transition"
      >
        বাতিল
      </button>
    </div>
  </form>
</template>

