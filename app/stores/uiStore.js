// stores/uiStore.js
export const useUiStore = defineStore('ui', () => {
  const load = reactive({})

  const isLoading = (key) => {
    return load[key] == true;
  }
  

  const loading = async (key, action) => {
    load[key] = true;
    try{
     // console.log('loading Begin 1')
      return await action()
    }catch{
      // console.log('loading Error 3')
      showToast('error', 'দুক্ষিত, আবার চেষ্টা করুন। ');
    }finally{
      // console.log('Action Begin 2')
      load[key] = false; 
    }
  }

  const saveButtonText = ref('যুক্ত করুন')
  const updateButtonText = ref('সংরক্ষণ করুন')
  const addButtonText = ref('যুক্থ করুন')
  const cancleButtonText = ref('বাতিল করুন')
  let timeoutId = null;

  const showWizedModal = ref('')
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
    load, loading, isLoading, saveButtonText, cancleButtonText, updateButtonText, addButtonText, showWizedModal, selectedClassId, selectedStudentId, selectedSbujectId, sidebarOpen, resetAll, errors, toast, showToast, clearToast
  };
});
