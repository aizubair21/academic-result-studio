<script lang="ts" setup>
const ui = useUiStore();
const widget = useWidgetStore();


const studentsList = ref([]);
const allStudents = ref([]);
const classesList = ref([]);
const classesMap = ref({});
const editingId = ref(null);
const route = useRoute();

definePageMeta({
    layout: 'master',
})

const filteredStudents = computed(() => {
    if (!ui.selectedClassId) return [];
    return [...allStudents.value]
        .filter(s => s.classId === Number(ui.selectedClassId))
        .sort((a, b) => (a.roll ?? 0) - (b.roll ?? 0));
});

onMounted(async () => {
    if (route.query.classId) {
        ui.selectedClassId = Number(route.query.classId);
    }
    await fetchData();
})

async function fetchData() {
    const [students, classes] = await Promise.all([
        useStudents().all(),
        useClasses().all(),
    ]);
    allStudents.value = students;
    classesList.value = [...classes].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    // Build class lookup map
    const map = {};
    classes.forEach(c => { map[c.id] = c.name; });
    classesMap.value = map;
}

async function onClassChange() {
    // Filter will auto-update via computed
}

function handleSaved() {
    ui.showWizedModal = false;
    editingId.value = null;
    fetchData();
}


function startEdit(id) {
    editingId.value = id;
}

function cancelEdit() {
    editingId.value = null;
}

async function handleDelete(id) {
    if (confirm('আপনি কি নিশ্চিতভাবে এই শিক্ষার্থীটি মুছে ফেলতে চান?')) {
        try {
            await useStudents().remove(id);
            ui.showToast('success', 'শিক্ষার্থীটি মুছে ফেলা হয়েছে');
            await fetchData();
        } catch (err) {
            ui.showToast('error', 'মুছে ফেলতে সমস্যা হয়েছে: ' + err);
        }
    }
}

function getClassName(classId) {
    return classesMap.value[classId] || '—';
}
</script>

<template>
    <AppCard>
        <template #header>
            <h1 class="text-3xl font-bold text-slate-900">শিক্ষার্থীবৃন্দ</h1>

            <div class='flex items-center justify-between gap-3'>
                <!-- <AppButton variant="primary" type="button" @click="openCreateModal">যোগ করুন</AppButton> -->
                <select v-if="ui.selectedClassId" v-model="ui.selectedClassId" @change="onClassChange"
                    class="mx-w-sm px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                    <option :value="null" selected disabled>ক্লাস নির্বাচন করুন</option>
                    <option v-for="cls in classesList" :key="cls.id" :value="cls.id">
                        {{ cls.name }} ({{ cls.index ?? '—' }})
                    </option>
                </select>
                <LayoutsPartialsPanelRightOpen variant="primary" type="plus" />
            </div>
        </template>

        <!-- No class selected -->
        <AppEmpty v-if="!ui.selectedClassId" title="ক্লাস নির্বাচন করুন"
            description="যে ক্লাসের শিক্ষার্থী দেখতে চান অনুগ্রহপুর্বক নির্বাচন করুন">
            <select v-model="ui.selectedClassId" @change="onClassChange"
                class="mx-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                <option :value="null" selected disabled>ক্লাস নির্বাচন করুন</option>
                <option v-for="cls in classesList" :key="cls.id" :value="cls.id">
                    {{ cls.name }} ({{ cls.index ?? '—' }})
                </option>
            </select>
        </AppEmpty>

        <!-- No students for selected class -->
        <AppEmpty v-else-if="filteredStudents.length === 0" title="কোনো শিক্ষার্থী নেই"
            description="এই ক্লাসের জন্য কোনো শিক্ষার্থী যোগ করা হয়নি।" />

        <div v-else class="overflow-x-auto border border-slate-200 bg-white shadow-lg shadow-slate-200/60 rounded-lg">
            <table class="min-w-full border-collapse text-left text-sm text-slate-700">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">ক্রমিক</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">ক্লাস</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">নাম</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">রোল</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                    <tr v-for="(student, index) in filteredStudents" :key="student.id" class="hover:bg-slate-50">
                        <!-- View Mode -->
                        <template v-if="editingId !== student.id">
                            <td class="px-5 py-4">{{ index + 1 }}</td>
                            <td class="px-5 py-4">{{ getClassName(student.classId) }}</td>
                            <td class="px-5 py-4 font-medium">{{ student.name }}</td>
                            <td class="px-5 py-4">{{ student.roll ?? '—' }}</td>
                            <td class="px-5 py-4">
                                <div class="flex gap-2">
                                    <button @click="startEdit(student.id)"
                                        class="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition">
                                        এডিট
                                    </button>
                                    <button @click="handleDelete(student.id)"
                                        class="inline-flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 transition">
                                        ডিলিট
                                    </button>
                                </div>
                            </td>
                        </template>
                        <!-- Edit Mode -->
                        <template v-else>
                            <td colspan="5" class="px-5 py-3">
                                <ArsStudentsEdit :data="student" @saved="handleSaved" @cancel="cancelEdit" />
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
    </AppCard>

    <!-- ── Right Sidebar ── -->
    <LayoutsRightAsside title="শিক্ষার্থী যুক্ত করুন">
        <ArsStudentsCreate @saved="handleSaved" />
    </LayoutsRightAsside>
</template>

<style lang="postcss" scoped></style>
