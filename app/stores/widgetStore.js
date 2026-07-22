export const useWidgetStore = defineStore('widget', () => {

  const workflow = {
    current: 'institute',
    completed: {
      institute: false,
      classes: false,
      subjects:false,
      students:false,
    }
  }


  const widgetSteps = [
    {
      widget:'institute',
      name:'Institute',
      isActive:false,
      status:'pending',
    },
    {
      widget:'classes',
      name:'Classes',
      isActive:false,
      status:'pending'
    },
    {
      widget:'subjects',
      name:'Subjects',
      isActive:false,
      status:'pending',
    },
    {
      widget:'students',
      name:'Students',
      isActive:false,
      status:'pending'
    },
    
  ] 

  const reset = () => {
    this.$reset();
  }
  
  return {
    workflow, widgetSteps, reset
  };

});