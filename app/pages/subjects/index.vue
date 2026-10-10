<script lang="ts" setup>
const ui = useUiStore();
const subjectsList = ref([]);
const allSubjects = ref([]);
const classesList = ref([]);
const classesMap = ref({});
const editing = ref(null);
const showCreateModal = ref(false);
const showEditModal = ref(false);
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
    showEditModal.value = false;
}

function handleSaved() {
    showCreateModal.value = false;
    showEditModal.value = false;
    editing.value = null;
    fetchData();
}

function handleClose() {
    showCreateModal.value = false;
    showEditModal.value = false;
}

function startEdit(id) {
    editing.value = id;
    showEditModal.value = true;
}

function cancelEdit() {
    editing.value = null;
    showEditModal.value = false;
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
            <h1 class="text-xl font-bold text-slate-900">বিষয়সমূহ ({{allSubjects.length}})</h1>

            <AppButton variant="primary" type="button" @click="openCreateModal"> বিষয় যুক্ত করুন</AppButton>
        </template>

        <label v-if="ui.selectedClassId" class="block text-sm font-medium text-gray-700 mb-1.5">ক্লাস </label>
        <select v-if="ui.selectedClassId" v-model="ui.selectedClassId" @change="onClassChange"
            class="mb-3 mx-w-md px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
            <option :value="null" selected disabled>ক্লাস নির্বাচন করুন</option>
            <option v-for="cls in classesList" :key="cls.id" :value="cls.id">
                {{ cls.name }} ({{ cls.index ?? '—' }})
            </option>
        </select>


        <!-- No class selected -->
        <AppEmpty v-if="!ui.selectedClassId" title="ক্লাস নির্বাচন করুন"
            description="দয়া করে একটি ক্লাস নির্বাচন করুন।">
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
            <div>
                <AppButton variant="ghost" type="button" @click="ui.sidebarOpen = true"> বিষয় যুক্ত করুন </AppButton>
            </div>
        </AppEmpty>




        <div v-else class="overflow-x-auto border border-slate-200 bg-white shadow-lg shadow-slate-200/60 rounded-lg">
            <table class="min-w-full border-collapse text-left text-sm text-slate-700">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600 max-w-[10px}">ক্রমিক</th>
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
                        <td class="px-5 py-4 max-w-[10px]">{{ index + 1 }}</td>
                        <td class="px-5 py-4">{{ getClassName(sub.classId) }}</td>
                        <td class="px-5 py-4 font-medium">{{ sub.name }}</td>
                        <td class="px-5 py-4">{{ sub.total_mark ?? '—' }}</td>
                        <td class="px-5 py-4">{{ sub.pass_mark ?? '—' }}</td>
                        <td class="px-5 py-4">
                            <div class="flex gap-2">
                                <AppButton type="button" variant="primary" icon="pen" @click="startEdit(sub)" />
                                <AppButton type="button" variant="danger" icon="minus" @click="handleDelete(sub.id)" />
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </AppCard>

    <!-- Create Modal -->
    <AppModal title="বিষয় তৈরি করুন" :open="showCreateModal" @close="handleClose">
        <ArsSubjectsCreate @saved="handleSaved" />
    </AppModal>

    <!-- edit modal  -->
    <AppModal :open="showEditModal" @close="handleClose" title="বিষয় সম্পাদনা করুন" >
        <ArsSubjectsEdit :data="editing" @saved="handleSaved" @cancel="cancelEdit" />
    </AppModal>

</template>

<style lang="postcss" scoped></style>
