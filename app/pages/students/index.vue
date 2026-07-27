<script setup>
const ui = useUiStore();
const studentsList = ref([]);
const classesMap = ref({});
const editingId = ref(null);
const showCreateModal = ref(false);

definePageMeta({
    layout: 'app',
})

onMounted(async () => {
    await fetchData();
})

async function fetchData() {
    const [students, classes] = await Promise.all([
        useStudents().all(),
        useClasses().all(),
    ]);
    studentsList.value = students;
    // Build class lookup map
    const map = {};
    classes.forEach(c => { map[c.id] = c.name; });
    classesMap.value = map;
}

function openCreateModal() {
    showCreateModal.value = true;
}

function handleSaved() {
    showCreateModal.value = false;
    editingId.value = null;
    fetchData();
}

function handleClose() {
    showCreateModal.value = false;
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
            <AppButton variant="primary" type="button" @click="openCreateModal">যোগ করুন</AppButton>
        </template>

        <!-- <AppEmpty
            v-if="studentsList.length === 0"
            title="কোনো শিক্ষার্থী নেই"
            description="একটি শিক্ষার্থী যোগ করতে 'যোগ করুন' বাটনে ক্লিক করুন"
        /> -->

        <div class="overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-200/60 rounded-lg">
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
                    <tr v-for="(student, index) in studentsList" :key="student.id" class="hover:bg-slate-50">
                        <!-- View Mode -->
                        <template v-if="editingId !== student.id">
                            <td class="px-5 py-4">{{ index + 1 }}</td>
                            <td class="px-5 py-4">{{ getClassName(student.classId) }}</td>
                            <td class="px-5 py-4 font-medium">{{ student.name }}</td>
                            <td class="px-5 py-4">{{ student.roll ?? '—' }}</td>
                            <td class="px-5 py-4">
                                <div class="flex gap-2">
                                    <button
                                        @click="startEdit(student.id)"
                                        class="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition"
                                    >
                                        এডিট
                                    </button>
                                    <button
                                        @click="handleDelete(student.id)"
                                        class="inline-flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 transition"
                                    >
                                        ডিলিট
                                    </button>
                                </div>
                            </td>
                        </template>
                        <!-- Edit Mode -->
                        <template v-else>
                            <td colspan="5" class="px-5 py-3">
                                <ArsStudentsEdit
                                    :data="student"
                                    @saved="handleSaved"
                                    @cancel="cancelEdit"
                                />
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
    </AppCard>

    <!-- Create Modal -->
    <AppModal title="শিক্ষার্থী তৈরি করুন" :open="showCreateModal" @close="handleClose">
        <ArsStudentsCreate @saved="handleSaved" />
    </AppModal>
</template>

<style lang="postcss" scoped>

</style>
