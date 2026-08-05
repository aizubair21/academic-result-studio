<script lang="ts" setup>
const ui = useUiStore();
const subjectsList = ref([]);
const allSubjects = ref([]);
const classesList = ref([]);
const classesMap = ref({});
const editingId = ref(null);
const showCreateModal = ref(false);
const route = useRoute();

definePageMeta({
    layout: 'master',
})

const filteredSubjects = computed(() => {
    if (!ui.selectedClassId) return [];
    return [...allSubjects.value]
        .filter(s => s.classId === Number(ui.selectedClassId))
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
});



onMounted(async () => {
    if (route.query.classId) {
        ui.selectedClassId = Number(route.query.classId);
    }
    await fetchData();
})

async function fetchData() {
    const [subjects, classes] = await Promise.all([
        useSubjects().all(),
        useClasses().all(),
    ]);
    allSubjects.value = subjects;
    classesList.value = [...classes].sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
    // Build class lookup map
    const map = {};
    classes.forEach(c => { map[c.id] = c.name; });
    classesMap.value = map;
}

async function onClassChange() {
    // Filter will auto-update via computed
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

            <div class="flex items-center justify-between gap-3">
                <div>
                    <!-- <label class="block text-sm font-medium text-gray-700 mb-1.5">
                        ক্লাস <span class="text-red-500">*</span>
                    </label> -->
                    <select v-model="ui.selectedClassId" @change="onClassChange"
                        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                        <option :value="null" selected disabled>ক্লাস নির্বাচন করুন</option>
                        <option v-for="cls in classesList" :key="cls.id" :value="cls.id">
                            {{ cls.name }} ({{ cls.index ?? '—' }})
                        </option>
                    </select>
                </div>
                <LayoutsPartialsPanelRightOpen variant="primary" type="plus" />
            </div>
            <!-- <AppButton variant="primary" type="button" @click="openCreateModal">যোগ করুন</AppButton> -->
        </template>

        <!-- No class selected -->
        <AppEmpty v-if="!ui.selectedClassId" title="ক্লাস নির্বাচন করুন"
            description="দয়া করে ডান পাশের প্যানেল থেকে একটি ক্লাস নির্বাচন করুন।">
            <select v-model="ui.selectedClassId" @change="onClassChange"
                class="mx-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                <option :value="null" selected disabled>ক্লাস নির্বাচন করুন</option>
                <option v-for="cls in classesList" :key="cls.id" :value="cls.id">
                    {{ cls.name }} ({{ cls.index ?? '—' }})
                </option>
            </select>
        </AppEmpty>

        <!-- No subjects for selected class -->
        <AppEmpty v-else-if="filteredSubjects.length === 0" title="কোনো বিষয় নেই"
            description="এই ক্লাসের জন্য কোনো বিষয় যোগ করা হয়নি।">

        </AppEmpty>

        <div v-else class="overflow-x-auto border border-slate-200 bg-white shadow-lg shadow-slate-200/60 rounded-lg">
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
                    <tr v-for="(sub, index) in filteredSubjects" :key="sub.id" class="hover:bg-slate-50">
                        <!-- View Mode -->
                        <template v-if="editingId !== sub.id">
                            <td class="px-5 py-4">{{ index + 1 }}</td>
                            <td class="px-5 py-4">{{ getClassName(sub.classId) }}</td>
                            <td class="px-5 py-4 font-medium">{{ sub.name }}</td>
                            <td class="px-5 py-4">{{ sub.total_mark ?? '—' }}</td>
                            <td class="px-5 py-4">{{ sub.pass_mark ?? '—' }}</td>
                            <td class="px-5 py-4">
                                <div class="flex gap-2">
                                    <button @click="startEdit(sub.id)"
                                        class="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition">
                                        এডিট
                                    </button>
                                    <button @click="handleDelete(sub.id)"
                                        class="inline-flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 transition">
                                        ডিলিট
                                    </button>
                                </div>
                            </td>
                        </template>
                        <!-- Edit Mode -->
                        <template v-else>
                            <td colspan="7" class="px-5 py-3">
                                <ArsSubjectsEdit :data="sub" @saved="handleSaved" @cancel="cancelEdit" />
                            </td>
                        </template>
                    </tr>
                </tbody>
            </table>
        </div>
    </AppCard>

    <!-- Create Modal -->
    <AppModal title="বিষয় তৈরি করুন" :open="showCreateModal" @close="handleClose">
    </AppModal>

    <!-- ── Right Sidebar ── -->
    <LayoutsRightAsside title="বিষয় যুক্ত করুন">
        <ArsSubjectsCreate @saved="handleSaved" />
        <!-- <LayoutsRightAssideTitle> বিষয় ফিল্টার </LayoutsRightAssideTitle> -->

        <!-- Class Selector -->


        <!-- Summary -->
        <!-- <div v-if="ui.selectedClassId" class="border-t border-slate-200 pt-4">
            <div class="text-sm text-slate-600 space-y-1">
                <p><span class="font-medium">বিষয়:</span> {{ filteredSubjects.length }}টি</p>
            </div>
        </div> -->


    </LayoutsRightAsside>
</template>

<style lang="postcss" scoped></style>
