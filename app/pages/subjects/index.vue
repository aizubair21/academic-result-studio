<script setup>
const ui = useUiStore();
const subjectsList = ref([]);
const classesMap = ref({});
const editingId = ref(null);
const showCreateModal = ref(false);

definePageMeta({
    layout: 'master',
})

onMounted(async () => {
    await fetchData();
})

async function fetchData() {
    const [subjects, classes] = await Promise.all([
        useSubjects().all(),
        useClasses().all(),
    ]);
    subjectsList.value = subjects;
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
    if (confirm('আপনি কি নিশ্চিতভাবে এই বিষয়টি মুছে ফেলতে চান?')) {
        try {
            await useSubjects().remove(id);
            ui.showToast('success', 'বিষয়টি মুছে ফেলা হয়েছে');
            await fetchData();
        } catch (err) {
            ui.showToast('error', 'মুছে ফেলতে সমস্যা হয়েছে: ' + err);
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
            <h1 class="text-3xl font-bold text-slate-900">বিষয়সমূহ</h1>
            <AppButton variant="primary" type="button" @click="openCreateModal">যোগ করুন</AppButton>
        </template>

        <!-- <AppEmpty
            v-if="subjectsList.length === 0"
            title="কোনো বিষয় নেই"
            description="একটি বিষয় যোগ করতে 'যোগ করুন' বাটনে ক্লিক করুন"
        /> -->

        <div class="overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-200/60 rounded-lg">
            <table class="min-w-full border-collapse text-left text-sm text-slate-700">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">ক্রমিক</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">ক্লাস</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">নাম</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">মোট নম্বর</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">পাস নম্বর</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                    <tr v-for="(sub, index) in subjectsList" :key="sub.id" class="hover:bg-slate-50">
                        <!-- View Mode -->
                        <template v-if="editingId !== sub.id">
                            <td class="px-5 py-4">{{ index + 1 }}</td>
                            <td class="px-5 py-4">{{ getClassName(sub.classId) }}</td>
                            <td class="px-5 py-4 font-medium">{{ sub.name }}</td>
                            <td class="px-5 py-4">{{ sub.total_mark ?? '—' }}</td>
                            <td class="px-5 py-4">{{ sub.pass_mark ?? '—' }}</td>
                            <td class="px-5 py-4">
                                <div class="flex gap-2">
                                    <button
                                        @click="startEdit(sub.id)"
                                        class="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition"
                                    >
                                        এডিট
                                    </button>
                                    <button
                                        @click="handleDelete(sub.id)"
                                        class="inline-flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 transition"
                                    >
                                        ডিলিট
                                    </button>
                                </div>
                            </td>
                        </template>
                        <!-- Edit Mode -->
                        <template v-else>
                            <td colspan="6" class="px-5 py-3">
                                <ArsSubjectsEdit
                                    :data="sub"
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
    <AppModal title="বিষয় তৈরি করুন" :open="showCreateModal" @close="handleClose">
        <ArsSubjectsCreate @saved="handleSaved" />
    </AppModal>
</template>

<style lang="postcss" scoped>

</style>
