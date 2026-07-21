// stores/uiStore.js
export const useUiStore = defineStore('ui', () => {
  const activeWidget = ref('institute');
  const showWizedModal = ref(false)
  const selectedClassId = ref(null)
  const selectedStudentId = ref(null)
  const selectedSbujectId = ref(null)
  const sidebarOpen = ref(true);


  return {
    activeWidget, showWizedModal, selectedClassId, selectedStudentId, selectedSbujectId, sidebarOpen,
  };
}, {
  persist:true
});