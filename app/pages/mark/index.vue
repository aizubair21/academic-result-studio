<script setup>
const ui = useUiStore();
const marksRepo = useMarks();
const studentsRepo = useStudents();
const subjectsRepo = useSubjects();
const classesRepo = useClasses();

definePageMeta({
    layout: 'master',
})

// ─── Reactive State ──────────────────────────────────────────────
const classesList = ref([]);
const subjectsList = ref([]);
const studentsList = ref([]);
const marksMap = ref({});        // key: `${studentId}-${subjectId}` → mark value

const selectedClassId = computed({
    get: () => ui.selectedClassId,
    set: (val) => { ui.selectedClassId = val; },
});

const selectedStudentId = computed({
    get: () => ui.selectedStudentId,
    set: (val) => { ui.selectedStudentId = val; },
});

const savingRows = ref(new Set());   // track which student rows are saving
const markErrors = ref({});          // key: `${studentId}-${subjectId}` → error message

// ─── Computed ────────────────────────────────────────────────────

/** Filtered students based on selected student filter, sorted by roll */
const filteredStudents = computed(() => {
    const list = !selectedStudentId.value
        ? studentsList.value
        : studentsList.value.filter(s => s.id === selectedStudentId.value);
    return [...list].sort((a, b) => (a.roll ?? 0) - (b.roll ?? 0));
});

/** Subjects sorted by index for consistent column order */
const sortedSubjects = computed(() => {
    return [...subjectsList.value].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
});

/** Check if all students are displayed (no specific student selected) */
const isShowingAllStudents = computed(() => !selectedStudentId.value);

/** Get the mark value for a specific student+subject */
function getMarkValue(studentId, subjectId) {
    const key = `${studentId}-${subjectId}`;
    return marksMap.value[key] ?? '';
}

/** Set mark value in the local map and validate */
function setMarkValue(studentId, subjectId, value) {
    const key = `${studentId}-${subjectId}`;
    const subject = subjectsList.value.find(s => s.id === subjectId);

    // Clear previous error
    delete markErrors.value[key];

    if (value === '' || value === null) {
        delete marksMap.value[key];
        return;
    }

    const numValue = Number(value);
    marksMap.value[key] = numValue;

    // Validate: must be >= 0 and <= total_mark
    if (isNaN(numValue)) {
        markErrors.value[key] = 'সংখ্যা দিন';
    } else if (numValue < 0) {
        markErrors.value[key] = '০ এর কম হবে না';
    } else if (subject && subject.total_mark && numValue > Number(subject.total_mark)) {
        markErrors.value[key] = `সর্বোচ্চ ${subject.total_mark} নম্বর`;
    } else if (numValue > 999) {
        markErrors.value[key] = 'অতি বড় মান';
    }
}

/** Validate a specific mark value */
function getMarkError(studentId, subjectId) {
    const key = `${studentId}-${subjectId}`;
    return markErrors.value[key] || '';
}

/** Check if a student's marks have any validation errors */
function hasMarkErrors(studentId) {
    return sortedSubjects.value.some(sub => {
        const key = `${studentId}-${sub.id}`;
        return !!markErrors.value[key];
    });
}

/** Check if a student has any unsaved marks */
function hasUnsavedMarks(studentId) {
    return sortedSubjects.value.some(sub => {
        const val = getMarkValue(studentId, sub.id);
        return val !== '' && val !== null && val !== undefined;
    });
}

// ─── Data Loading ────────────────────────────────────────────────

onMounted(async () => {
    // Load all classes for the selector, sorted by index
    const allClasses = await classesRepo.all();
    classesList.value = [...allClasses].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

    // If a class was previously selected, load its data
    if (selectedClassId.value) {
        await loadClassData(selectedClassId.value);
    }
});

async function loadClassData(classId) {
    if (!classId) {
        subjectsList.value = [];
        studentsList.value = [];
        marksMap.value = {};
        return;
    }

    const numId = Number(classId);

    const [subjects, students, existingMarks] = await Promise.all([
        subjectsRepo.all().then(list => list.filter(s => s.classId === numId)),
        studentsRepo.all().then(list => list.filter(s => s.classId === numId)),
        marksRepo.getMarksForClass(numId),
    ]);

    subjectsList.value = subjects;
    studentsList.value = students;

    // Build marks lookup map
    const map = {};
    existingMarks.forEach(m => {
        const key = `${m.studentId}-${m.subjectId}`;
        map[key] = m.mark;
    });
    marksMap.value = map;

    // Reset student filter when class changes
    selectedStudentId.value = null;
}

async function onClassChange() {
    await loadClassData(selectedClassId.value);
}

// ─── Save Operations ─────────────────────────────────────────────

async function saveStudentMarks(studentId) {
    // Check for validation errors first
    if (hasMarkErrors(studentId)) {
        ui.showToast('error', 'কিছু নম্বর সঠিক নয়। অনুগ্রহ করে লাল মার্ক করা ঘরগুলো ঠিক করুন।');
        return;
    }

    savingRows.value.add(studentId);

    try {
        const marks = sortedSubjects.value
            .filter(sub => {
                const val = getMarkValue(studentId, sub.id);
                return val !== '' && val !== null && val !== undefined;
            })
            .map(sub => ({
                subjectId: sub.id,
                mark: Number(getMarkValue(studentId, sub.id)),
            }));

        if (marks.length === 0) {
            ui.showToast('warning', 'কোনো নম্বর দেওয়া হয়নি');
            return;
        }

        await marksRepo.bulkUpsertForStudent(studentId, Number(selectedClassId.value), marks);
        ui.showToast('success', 'নম্বর সংরক্ষিত হয়েছে');

        // Reload marks to sync
        const freshMarks = await marksRepo.getMarksForClass(Number(selectedClassId.value));
        const map = {};
        freshMarks.forEach(m => {
            const key = `${m.studentId}-${m.subjectId}`;
            map[key] = m.mark;
        });
        marksMap.value = map;
    } catch (err) {
        ui.showToast('error', 'নম্বর সংরক্ষণে সমস্যা: ' + err);
    } finally {
        savingRows.value.delete(studentId);
    }
}

async function saveAllMarks() {
    const studentsToSave = filteredStudents.value;

    // Check all students for validation errors
    let hasErrors = false;
    for (const student of studentsToSave) {
        if (hasMarkErrors(student.id)) {
            hasErrors = true;
            break;
        }
    }
    if (hasErrors) {
        ui.showToast('error', 'কিছু নম্বর সঠিক নয়। অনুগ্রহ করে লাল মার্ক করা ঘরগুলো ঠিক করুন।');
        return;
    }

    for (const student of studentsToSave) {
        const marks = sortedSubjects.value
            .filter(sub => {
                const val = getMarkValue(student.id, sub.id);
                return val !== '' && val !== null && val !== undefined;
            })
            .map(sub => ({
                subjectId: sub.id,
                mark: Number(getMarkValue(student.id, sub.id)),
            }));

        if (marks.length > 0) {
            try {
                await marksRepo.bulkUpsertForStudent(student.id, Number(selectedClassId.value), marks);
            } catch (err) {
                ui.showToast('error', `${student.name} এর নম্বর সংরক্ষণে সমস্যা: ${err}`);
            }
        }
    }

    // Reload marks
    const freshMarks = await marksRepo.getMarksForClass(Number(selectedClassId.value));
    const map = {};
    freshMarks.forEach(m => {
        const key = `${m.studentId}-${m.subjectId}`;
        map[key] = m.mark;
    });
    marksMap.value = map;

    ui.showToast('success', 'সকল নম্বর সংরক্ষিত হয়েছে');
}
</script>

<template>

    <!-- ── Main Content ── -->
    <AppCard>
        <template #header>
            <h1 class="text-3xl font-bold text-slate-900">মার্ক প্রবেশ করান</h1>
            <div class="flex gap-2">
                <AppButton
                    v-if="selectedClassId && filteredStudents.length > 1"
                    variant="secondary"
                    type="button"
                    @click="saveAllMarks"
                >
                    সকল নম্বর সংরক্ষণ
                </AppButton>
            </div>
        </template>

        <!-- No class selected -->
        <AppEmpty
            v-if="!selectedClassId"
            title="ক্লাস নির্বাচন করুন"
            description="দয়া করে ডান পাশের প্যানেল থেকে একটি ক্লাস নির্বাচন করুন।"
        />

        <!-- No subjects found -->
        <AppEmpty
            v-else-if="subjectsList.length === 0"
            title="কোনো বিষয় নেই"
            description="এই ক্লাসের জন্য কোনো বিষয় যোগ করা হয়নি। দয়া করে বিষয় পৃষ্ঠা থেকে বিষয় যোগ করুন।"
        />

        <!-- No students found -->
        <AppEmpty
            v-else-if="studentsList.length === 0"
            title="কোনো শিক্ষার্থী নেই"
            description="এই ক্লাসের জন্য কোনো শিক্ষার্থী যোগ করা হয়নি। দয়া করে শিক্ষার্থী পৃষ্ঠা থেকে শিক্ষার্থী যোগ করুন।"
        />

        <!-- Marks Entry Table -->
        <div
            v-else
            class="overflow-x-auto border border-slate-200 bg-white shadow-lg shadow-slate-200/60 rounded-lg"
        >
            <table class="min-w-full border-collapse text-left text-sm text-slate-700">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="border-b border-slate-200 px-4 py-4 font-semibold text-slate-600 w-14">ক্রমিক</th>
                        <th class="border-b border-slate-200 px-4 py-4 font-semibold text-slate-600 w-40">শিক্ষার্থীর নাম</th>
                        <th class="border-b border-slate-200 px-4 py-4 font-semibold text-slate-600 w-16">রোল</th>
                        <th
                            v-for="subject in sortedSubjects"
                            :key="subject.id"
                            class="border-b border-slate-200 px-3 py-4 font-semibold text-slate-600 min-w-[100px] text-center"
                        >
                            <div class="text-xs leading-tight">
                                <div>{{ subject.name }}</div>
                                <div class="text-[10px] text-slate-400 font-normal">
                                    ({{ subject.total_mark ?? '—' }}/{{ subject.pass_mark ?? '—' }})
                                </div>
                            </div>
                        </th>
                        <th class="border-b border-slate-200 px-4 py-4 font-semibold text-slate-600 w-20">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                    <tr
                        v-for="(student, index) in filteredStudents"
                        :key="student.id"
                        class="hover:bg-slate-50 transition"
                    >
                        <td class="px-4 py-3 text-center text-slate-500">{{ index + 1 }}</td>
                        <td class="px-4 py-3 font-medium text-slate-800">{{ student.name }}</td>
                        <td class="px-4 py-3 text-center">{{ student.roll ?? '—' }}</td>

                        <!-- Mark input for each subject -->
                        <td
                            v-for="subject in sortedSubjects"
                            :key="`${student.id}-${subject.id}`"
                            class="px-2 py-2 relative"
                        >
                            <div class="relative">
                                <input
                                    type="number"
                                    :value="getMarkValue(student.id, subject.id)"
                                    @input="setMarkValue(student.id, subject.id, $event.target.value)"
                                    :placeholder="`0-${subject.total_mark ?? 100}`"
                                    min="0"
                                    :max="subject.total_mark ?? 999"
                                    step="0.5"
                                    class="w-full px-2 py-1.5 text-center border rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all text-sm"
                                    :class="getMarkError(student.id, subject.id) ? 'border-red-400 bg-red-50' : 'border-slate-300'"
                                />
                                <div
                                    v-if="getMarkError(student.id, subject.id)"
                                    class="absolute -bottom-5 left-0 right-0 text-[10px] text-red-500 text-center leading-tight pointer-events-none"
                                >
                                    {{ getMarkError(student.id, subject.id) }}
                                </div>
                            </div>
                        </td>

                        <!-- Save button per student -->
                        <td class="px-4 py-3 text-center">
                            <button
                                @click="saveStudentMarks(student.id)"
                                :disabled="savingRows.has(student.id)"
                                class="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-150"
                                :class="savingRows.has(student.id)
                                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'"
                            >
                                <span v-if="savingRows.has(student.id)">
                                    {{ ui.saving ? 'সেইভ হচ্ছে...' : 'সংরক্ষণ' }}
                                </span>
                                <span v-else>সংরক্ষণ</span>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Bottom info bar -->
        <template #footer v-if="selectedClassId && subjectsList.length > 0 && studentsList.length > 0">
            <div class="flex items-center justify-between text-xs text-slate-500">
                <span>
                    <strong>{{ filteredStudents.length }}</strong> জন শিক্ষার্থী,
                    <strong>{{ sortedSubjects.length }}</strong> টি বিষয়
                </span>
                <span>
                    প্রতিটি ঘরে নম্বর লিখে "সংরক্ষণ" বাটনে ক্লিক করুন
                </span>
            </div>
        </template>
    </AppCard>


    <!-- ── Right Sidebar Content (via named slot) ── -->
    <LayoutsRightAsside>
        <LayoutsRightAssideTitle> মার্ক ফিল্টার </LayoutsRightAssideTitle>

        <!-- Class Selector -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                ক্লাস <span class="text-red-500">*</span>
            </label>
            <select
                v-model="selectedClassId"
                @change="onClassChange"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
                <option value="" selected>ক্লাস নির্বাচন করুন</option>
                <option
                    v-for="cls in classesList"
                    :key="cls.id"
                    :value="cls.id"
                >
                    {{ cls.name }}
                </option>
            </select>
        </div>

        

        <!-- Student Selector (optional filter) -->
        <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                শিক্ষার্থী
                <span class="text-xs text-gray-400 font-normal">(ঐচ্ছিক)</span>
            </label>
            <select
                v-model="selectedStudentId"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
                <option :value="null">সকল শিক্ষার্থী</option>
                <option
                    v-for="student in [...studentsList].sort((a, b) => (a.roll ?? 0) - (b.roll ?? 0))"
                    :key="student.id"
                    :value="student.id"
                >
                    {{ student.name }} (রোল: {{ student.roll }})
                </option>
            </select>
            <p class="mt-1.5 text-xs text-gray-500">
                {{ isShowingAllStudents ? 'সকল শিক্ষার্থী প্রদর্শিত হচ্ছে' : 'নির্বাচিত শিক্ষার্থী প্রদর্শিত হচ্ছে' }}
            </p>
        </div>

        <!-- Summary -->
        <div v-if="selectedClassId" class="border-t border-slate-200 pt-4">
            <div class="text-sm text-slate-600 space-y-1">
                <p><span class="font-medium">বিষয়:</span> {{ subjectsList.length }}টি</p>
                <p><span class="font-medium">শিক্ষার্থী:</span> {{ studentsList.length }} জন</p>
                <p><span class="font-medium">প্রদর্শিত:</span> {{ filteredStudents.length }} জন</p>
            </div>
        </div>
    </LayoutsRightAsside>

</template>

<style lang="postcss" scoped>
/* Style number input spin buttons */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
    opacity: 1;
    height: 24px;
}

input[type="number"] {
    -moz-appearance: textfield;
}
</style>

