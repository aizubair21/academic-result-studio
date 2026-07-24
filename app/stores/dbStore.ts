// stores/uiStore.js
export const useUiStore = defineStore('ui', () => {
    const institute = ref({
        name: '',
        markType: 'GPA',
    });
    const classes = ref([
        {
            id: null,
            name: '',
            index: '',
        }
    ])
    const subjects = ref([
        {
            id: null,
            name: '',
            classId: '',

        }
    ])
    const students = ref([
        {
            id: null,
            classId: '',
            name: '',
            roll: '',
        }
    ])
    const marks = ref([
        {
            id: '',
            studentId: '',
            classId: '',
            subjectId: '',
            mark: '',
        }
    ])


    const reset = () => {
        this.$reset();
    }

    return {
        institute, classes, subjects, students, marks, reset
    };
});