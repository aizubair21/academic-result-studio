<script setup>
const ui = useUiStore();
const classesList = ref([]);
const editingId = ref(null);

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
    const clist = await cls.all();
    classesList.value = clist.sort((a, b) => a.index - b.index);
}



function openCreateModal() {
    ui.showWizedModal = true;
}

function handleSaved() {
    ui.showWizedModal = false;
    editingId.value = null;
    fetchClasses();
}

function handleClose() {
    ui.showWizedModal = false;
}

function startEdit(id) {
    editingId.value = id;
}

function cancelEdit() {
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
            <h1 class="text-3xl font-bold text-slate-900">ক্লাসসমূহ</h1>
            <AppButton variant="primary" type="button" @click="openCreateModal">যোগ করুন</AppButton>
        </template>

        <AppEmpty
            v-if="classesList.length === 0"
            title="কোনো ক্লাস নেই"
            description="একটি ক্লাস যোগ করতে 'যোগ করুন' বাটনে ক্লিক করুন"
        />

        <div v-else class="overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-200/60 rounded-lg">
            <table class="min-w-full border-collapse text-left text-sm text-slate-700">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">ক্রমিক</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">নাম</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">ইনডেক্স</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                    <tr v-for="(cls, index) in classesList" :key="cls.id" class="hover:bg-slate-50">
                        <!-- View Mode -->
                        <template v-if="editingId !== cls.id">
                            <td class="px-5 py-4">{{ index + 1 }}</td>
                            <td class="px-5 py-4 font-medium">{{ cls.name }}</td>
                            <td class="px-5 py-4">{{ cls.index || '—' }}</td>
                            <td class="px-5 py-4">
                                <div class="flex gap-2">
                                    <button
                                        @click="startEdit(cls.id)"
                                        class="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition"
                                    >
                                        এডিট
                                    </button>
                                    <button
                                        @click="handleDelete(cls.id)"
                                        class="inline-flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 transition"
                                    >
                                        ডিলিট
                                    </button>
                                </div>
                            </td>
                        </template>
                        <!-- Edit Mode -->
                        <template v-else>
                            <td colspan="4" class="px-5 py-3">
                                <ArsClassesEdit
                                    :data="cls"
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

    <LayoutsRightAsside>
        <LayoutsRightAssideTitle > ক্লাস যুক্ত করুন </LayoutsRightAssideTitle>
        <ArsClassesCreate/>
    </LayoutsRightAsside>

    <!-- Create Modal -->
    <AppModal title="ক্লাস তৈরি করুন" :open="ui.showWizedModal" @close="handleClose">
        <ArsClassesCreate @handle-saved-from-parent="handleSaved" />
    </AppModal>
</template>

<style lang="postcss" scoped>

</style>
