// stores/uiStore.js
export const useUiStore = defineStore('ui', () => {
  const showWizedModal = ref(false)
  const selectedClassId = ref(null)
  const selectedStudentId = ref(null)
  const selectedSbujectId = ref(null)
  const sidebarOpen = ref(true);

  const reset = () => {
    this.$reset();
  }

  return {
    showWizedModal, selectedClassId, selectedStudentId, selectedSbujectId, sidebarOpen, reset
  };
});