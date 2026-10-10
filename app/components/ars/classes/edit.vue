<script setup>
const props = defineProps({
  data: { type: String, required: true }
});

const emit = defineEmits(['saved', 'cancel']);
const ui = useUiStore();
const classRepo = useClasses();

const form = reactive({
  name: '',
  index: '',
});

async function handleSubmit() {
  ui.saving = true;
  try {
    const classes = useClasses();
    await classes.update(props.data, {
      name: form.name.trim(),
      index: form.index ? Number(form.index) : undefined,
    });
    ui.showToast('success', 'ক্লাস আপডেট হয়েছে');
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

onMounted( async () => {
  const ab = await classRepo.find(props.data);
  form.name = ab.name;
  form.index = ab.index;
})
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-3">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">ক্লাসের নাম <span class="text-red-500">*</span></label>
      <input
        v-model="form.name"
        type="text"
        required
        placeholder="যেমন: নবম"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
      />
    </div>
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">ইনডেক্স</label>
      <input
        v-model="form.index"
        type="number"
        placeholder="যেমন: 9"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
      />
    </div>
    <div class="flex gap-2 pt-1">
      <AppButton
        type="submit"
        variant="primary"
        icon="check"
      >
        {{ ui.saving ? 'সেইভ হচ্ছে...' : 'সংরক্ষণ করুন' }}
      </AppButton>
      <AppButton
        type="button"
        variant="ghost"
        icon="x"
        @click="handleCancel"
      >
        বাতিল করুন
      </AppButton>
    </div>
  </form>
</template>

