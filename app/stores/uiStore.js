// stores/uiStore.js
export const useUiStore = defineStore('ui', () => {
  const loading = ref(false)
  const saving = ref(false)
  const saveButtonText = ref('সেইভ করুন')
  const updateButtonText = ref('‍আফডেট করুন')
  const addButtonText = ref('যোগ করুন')
  let timeoutId = null;

  const showWizedModal = ref(false)
  const selectedClassId = ref(null)
  const selectedStudentId = ref(null)
  const selectedSbujectId = ref(null)
  const sidebarOpen = ref(false);

  const errors = ref({})
  const toast = ref({
    message: '',
    type: '',
  })

  const clearToast = () => {
    toast.value.type = '';
    toast.value.message = '';
  };

  const showToast = (newType, newMessage) => {
    if (timeoutId) clearTimeout(timeoutId);
    toast.value.type = newType;
    toast.value.message = newMessage;
    timeoutId = setTimeout(() => {
      clearToast();
    }, 5000);
  };


  const resetAll = () => {
    this.$reset();
  }

  return {
    loading, saving, saveButtonText, updateButtonText, addButtonText, showWizedModal, selectedClassId, selectedStudentId, selectedSbujectId, sidebarOpen, resetAll, errors, toast, showToast, clearToast
  };
});
