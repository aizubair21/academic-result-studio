export const useWidgetStore = defineStore('widget', () => {

  const widgets = {
    institute: {
      widgetName: 'institute',
      widgetInfo: '',
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
  return {
    widgets, widgetSteps
  };

}, {
  persist:true,
});