<script setup>
const ui = useUiStore();
const classesList = ref([]);
const editingId = ref(null);
const studentsRepo = useStudents();
const subjectsRepo = useSubjects();
import { ChevronRight, Minus, PenLine } from "@lucide/vue";

const openCreateModal = ref(false);
const openEditModal = ref(false);

definePageMeta({
    layout: 'master',
})

onUpdated(() => {
    fetchClasses();
}),

onMounted(async () => {
    await fetchClasses();
})

async function fetchClasses() {
    const cls = useClasses();
    const [clist, students, subjects] = await Promise.all([
        cls.all(),
        studentsRepo.all(),
        subjectsRepo.all(),
    ]);

    const studentsCount = students.reduce((counts, student) => {
        counts[student.classId] = (counts[student.classId] || 0) + 1;
        return counts;
    }, {});
    const subjectsCount = subjects.reduce((counts, subject) => {
        counts[subject.classId] = (counts[subject.classId] || 0) + 1;
        return counts;
    }, {});

    classesList.value = clist
        .map(cls => ({
            ...cls,
            studentsCount: studentsCount[cls.id] || 0,
            subjectsCount: subjectsCount[cls.id] || 0,
        }))
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
}

function handleSaved() {
    ui.showWizedModal = false;
    editingId.value = null;
    openEditModal.value = false;
    fetchClasses();
}

function handleClose() {
    ui.showWizedModal = false;
    openEditModal.value = false;
}

function startEdit(id) {
    editingId.value = id;
    openEditModal.value = true;
}

function cancelEdit() {
    openEditModal.value = false;
    editingId.value = null;
}

async function handleDelete(id) {
    if (confirm('আপনি কি নিশ্চিতভাবে এই ক্লাসটি মুছে ফেলতে চান?')) {
        try {
            const cls = useClasses();
            await cls.remove(id);
            ui.showToast('success', 'ক্লাসটি মুছে ফেলা হয়েছে');
            await fetchClasses();
        } catch (err) {
            ui.showToast('error', 'মুছে ফেলতে সমস্যা হয়েছে: ' + err);
        }
    }
}
</script>

<template>
    <AppCard>
        <template #header>
            <h1 class="text-xl font-bold text-slate-900">ক্লাসসমূহ ({{classesList.length}}) </h1>
            <AppButton variant="primary" type="button" @click="openCreateModal = true"> ক্লাস যুক্ত করুন</AppButton>
            <!-- <LayoutsPartialsPanelRightOpen variant="primary" type="plus" title="শ্রেনী যুক্ত করুন" /> -->
        </template>

        <AppEmpty v-if="classesList.length === 0" title="এখনো কোন শ্রেনী যুক্ত করা হয়নি"
            description="একটি ক্লাস যোগ করতে '+' বাটনে ক্লিক করুন" />

        <div v-else class="overflow-x-auto border border-slate-200 bg-white shadow-lg shadow-slate-200/60 rounded-lg">
            <table class="min-w-full border-collapse text-left text-sm text-slate-700">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600 max-w-[10px]">ক্রমিক
                        </th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">নাম</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">বিষয়</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">শিক্ষার্থী</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600 flex-1">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                    <tr v-for="(cls, index) in classesList" :key="cls.id" class="hover:bg-slate-50">
                        <!-- View Mode -->
                            <td class="px-5 py-4 max-w-[20px]">{{ index + 1 }}</td>
                            <td class="px-5 py-4 font-medium ">({{ cls.id }})-{{ cls.name }} </td>
                            <td class="px-5 py-4 inline-flex">
                                
                                <NuxtLink :to="{ path: '/subjects', query: { classId: cls.id } }"
                                    class="flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 transition">
                                    {{ cls.subjectsCount }}
                                    <ChevronRight size='14'/>    

                                </NuxtLink>

                            </td>
                            <td class="px-5 py-4">

                                <NuxtLink :to="{ path: '/students', query: { classId: cls.id } }"
                                    class="inline-flex items-center rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition">
                                        {{ cls.studentsCount }}
                                        <ChevronRight size='14'/>                            

                                </NuxtLink>
                            </td>
                            <td class="px-5 py-4 ">
                                <div class="flex gap-2">
                                   
                                    <AppButton type="button" variant="primary" @click="startEdit(cls.id)">
                                        <PenLine size="15"/>
                                    </AppButton>
                                    <AppButton type="button" variant="danger" @click="handleDelete(cls.id)">
                                        <Minus size="15" />
                                    </AppButton>

                                </div>
                            </td>
                        <!-- <template>
                        </template> -->
                        <!-- Edit Mode -->
                        <!-- <template v-else>
                            <td colspan="5" class="px-5 py-3">
                                <ArsClassesEdit :data="cls" @saved="handleSaved" @cancel="cancelEdit" />
                            </td>
                        </template> -->
                    </tr>
                </tbody>
            </table>
        </div>
    </AppCard>


    <!-- create modal  -->
    <AppModal :open="openCreateModal" @close="openCreateModal = false" title="ক্লাস যুক্ত করুন">
        <ArsClassesCreate @saved="handleSaved" />
    </AppModal>

    <!-- eidt modal  -->
    <AppModal :open="openEditModal" @close="cancelEdit" title="ক্লাস সম্পাদনা করুন">
        <ArsClassesEdit :data="editingId" @saved="handleSaved" @cancel="cancelEdit"/>
    </AppModal>

</template>

<style lang="postcss" scoped></style>
