<script setup>
const uiStore = useUiStore();
const widgetStore = useWidgetStore();
// import { useInstitute } from '~/composables/useInstitute';

const emit = defineEmits(['close', 'saved', 'deleted']);

const { getInstitute, saveInstitute, updateInstitute } = useInstitute();
// const uiStore = useUiStore();

// Form state
const form = ref({
  name: '',
  email: '',
  session: '',
  headSirName: '',
});

const errors = ref({});
const saving = ref(false);
const errorMsg = ref(null);
const successMsg = ref(null);

// Delete modal
const showDeleteModal = ref(false);
const deleting = ref(false);

// Load data if editing
// watchEffect(async () => {
//   if (props.visible && isEdit.value) {
//     const institute = await getInstitute();
//     if (institute) {
//       form.name = institute.name || '';
//       form.email = institute.email || '';
//       form.session = institute.session || '';
//       form.headSirName = institute.headSirName || '';
//     }
//   }
// });

// Validation
const validateForm = () => {
  Object.keys(errors).forEach(k => delete errors[k]);
  errorMsg.value = null;

  if (!form.name.trim()) errors.name = 'প্রতিষ্ঠানের নাম আবশ্যক';
  if (!form.email.trim()) errors.email = 'ইমেইল আবশ্যক';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'সঠিক ইমেইল দিন';
  if (!form.session.trim()) errors.session = 'সেশন আবশ্যক';
  if (!form.headSirName.trim()) errors.headSirName = 'প্রধান শিক্ষকের নাম আবশ্যক';

  return Object.keys(errors).length === 0;
};


// const validateForm = () => {
//   return Object.keys(errors).length === 0;
// };

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) return;

  saving.value = true;
  errorMsg.value = null;
  successMsg.value = null;

  try {
    const data = {
      name: form.name.trim(),
      email: form.email.trim(),
      session: form.session.trim(),
      headSirName: form.headSirName.trim(),
    };

    await saveInstitute(data);
    successMsg.value = 'ইনস্টিটিউট সফলভাবে তৈরি হয়েছে!';

    emit('saved');
    
    // Auto close after success
    setTimeout(() => {
      handleClose();
    }, 1500);
  } catch (err) {
    errorMsg.value = err.message || 'কিছু ভুল হয়েছে';
  } finally {
    saving.value = false;
  }
};



</script>


<template>
  <Transition>
    <div v-if="widgetStore.workflow.current == 'institute'">
      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Error Alert -->
        <div v-if="errorMsg" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ errorMsg }}
        </div>

        <!-- Success Alert -->
        <div v-if="successMsg" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {{ successMsg }}
        </div>

        <!-- Institute Name -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1.5">
            প্রতিষ্ঠানের নাম <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="যেমন: মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
        </div>

        <!-- Footer Buttons -->
        <div class="flex gap-3 pt-4 border-t">
          <!-- Delete Button (শুধু Edit মোডে) -->
          <button
            v-if="isEdit"
            type="button"
            @click="handleDeleteClick"
            class="px-4 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors font-medium"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              ডিলিট
            </span>
          </button>

          <div class="flex-1"></div>

          <button
            type="submit"
            :disabled="saving"
            class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center gap-2"
          >
            <svg v-if="saving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
              সেভ
          </button>
        </div>
      </form>
    </div>
  </Transition>
</template>
    
<style lang="postcss" scoped>
    
</style>
