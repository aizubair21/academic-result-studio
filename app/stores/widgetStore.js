export const useWidgetStore = defineStore('widget', () => {

  // Step definitions with metadata
  const widgetSteps = [
    {
      name: 'প্রতিষ্ঠান',
      widget: 'institute',
      icon: '🏫',
      description: 'প্রতিষ্ঠানের নাম যোগ করুন',
      allowMultiple: false,
    },
    {
      name: 'ক্লাস',
      widget: 'classes',
      icon: '📚',
      description: 'ক্লাস সমূহ যোগ করুন (একাধিক)',
      allowMultiple: true,
    },
    {
      name: 'বিষয়',
      widget: 'subjects',
      icon: '📖',
      description: 'প্রতিটি ক্লাসের বিষয় যোগ করুন (একাধিক)',
      allowMultiple: true,
    },
    {
      name: 'শিক্ষার্থী',
      widget: 'students',
      icon: '👨‍🎓',
      description: 'শিক্ষার্থীদের তথ্য যোগ করুন (একাধিক)',
      allowMultiple: true,
    },
  ];

  const workflow = reactive({
    current: '',
    completed: {
      institute: false,
      classes: false,
      subjects: false,
      students: false,
    }
  });

  // Computed: current step index
  const currentStepIndex = computed(() => {
    const idx = widgetSteps.findIndex(s => s.widget === workflow.current);
    return idx >= 0 ? idx : -1;
  });

  // Computed: total steps count
  const stepCount = computed(() => widgetSteps.length);

  // Computed: completed steps count
  const completedStepCount = computed(() => {
    return widgetSteps.filter(s => workflow.completed[s.widget]).length;
  });

  // Computed: progress percentage
  const progressPercent = computed(() => {
    if (stepCount.value === 0) return 0;
    return Math.round((completedStepCount.value / stepCount.value) * 100);
  });

  // Check if a specific step is complete
  const isStepComplete = (stepName) => {
    return workflow.completed[stepName] === true;
  };

  // Check if a step is accessible (all previous steps completed)
  const isStepAccessible = (stepName) => {
    const idx = widgetSteps.findIndex(s => s.widget === stepName);
    if (idx === -1 || idx === 0) return true;
    // Check all previous steps are completed
    return widgetSteps.slice(0, idx).every(s => workflow.completed[s.widget]);
  };

  // Navigate to a specific step
  const goToStep = (stepName) => {
    if (isStepAccessible(stepName)) {
      workflow.current = stepName;
    }
  };

  // Mark a step as completed and go to next
  const completeStep = (stepName) => {
    if (workflow.completed[stepName] !== undefined) {
      workflow.completed[stepName] = true;
    }
  };

  // Manually advance to the next incomplete step
  const goToNextStep = () => {
    const currentIdx = currentStepIndex.value;
    if (currentIdx === -1) {
      // If on dashboard, go to first incomplete step
      const nextIncomplete = widgetSteps.find(s => !workflow.completed[s.widget]);
      if (nextIncomplete) {
        workflow.current = nextIncomplete.widget;
      }
      return;
    }

    // Mark current as completed if not already
    const currentWidget = widgetSteps[currentIdx].widget;
    if (currentWidget !== 'institute') {
      // Only mark non-institute (single-item) steps as complete on manual advance
      completeStep(currentWidget);
    }

    // Find next incomplete step
    const nextIncomplete = widgetSteps.slice(currentIdx + 1).find(s => !workflow.completed[s.widget]);
    if (nextIncomplete) {
      workflow.current = nextIncomplete.widget;
    } else {
      workflow.current = 'dashboard';
    }
  };

  const reset = () => {
    workflow.current = '';
    Object.keys(workflow.completed).forEach(k => {
      workflow.completed[k] = false;
    });
  };

  return {
    workflow,
    widgetSteps,
    currentStepIndex,
    stepCount,
    completedStepCount,
    progressPercent,
    isStepComplete,
    isStepAccessible,
    goToStep,
    completeStep,
    goToNextStep,
    reset,
  };

});
