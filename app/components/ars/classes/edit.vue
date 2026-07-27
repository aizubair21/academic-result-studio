<script setup>
const props = defineProps({
  data: { type: Object, required: true }
});

const emit = defineEmits(['saved', 'cancel']);

const ui = useUiStore();

const form = reactive({
  name: props.data.name || '',
  index: props.data.index || '',
});

async function handleSubmit() {
  ui.saving = true;
  try {
    const classes = useClasses();
    await classes.update(props.data.id, {
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

