// stores/uiStore.js
export const useUiStore = defineStore('ui', () => {
  const loading = ref(false)
  const saving = ref(false)
  const saveButtonText = ref('সেইভ করুন')
  const updateButtonText = ref('‍আফডেট করুন')
  let timeoutId = null;


  const showWizedModal = ref(false)
  const selectedClassId = ref(null)
  const selectedStudentId = ref(null)
  const selectedSbujectId = ref(null)
  const sidebarOpen = ref(true);

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
    // Clear any existing timer if a new toast comes in quickly
    if (timeoutId) clearTimeout(timeoutId);
    
    // Set values
    toast.value.type = newType;
    toast.value.message = newMessage;

    // Set timer to clear after 2 seconds (2000ms)
    timeoutId = setTimeout(() => {
      clearToast();
    }, 5000);
  };



  const reset = () => {
    this.$reset();
  }

  return {
    loading, saving, saveButtonText, updateButtonText, showWizedModal, selectedClassId, selectedStudentId, selectedSbujectId, sidebarOpen, reset, errors, toast, showToast, clearToast
  };
});