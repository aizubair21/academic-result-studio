export const useWidgetStore = defineStore('widget', () => {

  const workflow = {
    current: '',
    completed: {
      institute: false,
      classes: false,
      subjects:false,
      students:false,
    }
  }

  const reset = () => {
    this.$reset();
  }
  
  return {
    workflow, reset
  };

});