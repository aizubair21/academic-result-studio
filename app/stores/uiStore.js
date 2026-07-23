// stores/uiStore.js
export const useUiStore = defineStore('ui', () => {
  const loading = ref(false)
  const saving = ref(false)

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

  const reset = () => {
    this.$reset();
  }

  return {
    loading, saving, showWizedModal, selectedClassId, selectedStudentId, selectedSbujectId, sidebarOpen, reset, errors, toast
  };
});