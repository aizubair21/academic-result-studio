<script setup>
const ui = useUiStore();
const instituteList = ref([]);

definePageMeta({
    layout: 'app',
})

onMounted(async () => {
    await fetchInstitutes();
})

async function fetchInstitutes() {
    const inst = useInstitute();
    instituteList.value = await inst.all();
    console.log(instituteList);
    
}

// Delete handler
async function handleDelete(id) {
    if (confirm('আপনি কি নিশ্চিতভাবে এই প্রতিষ্ঠানটি মুছে ফেলতে চান?')) {
        try {
            const inst = useInstitute();
            await inst.remove(id);
            ui.showToast('success', 'প্রতিষ্ঠানটি সফলভাবে মুছে ফেলা হয়েছে');
            await fetchInstitutes();
        } catch (err) {
            ui.showToast('error', 'মুছে ফেলার সময় সমস্যা হয়েছে: ' + err);
        }
    }
}

// Modal state
const showCreateModal = ref(false);

function openCreateModal() {
    showCreateModal.value = true;
}

function handleSaved() {
    showCreateModal.value = false;
    fetchInstitutes();
}

function handleClose() {
    showCreateModal.value = false;
}
</script>

<template>
    <AppCard>
        <template #header>
            <h1 class="text-3xl font-bold text-slate-900">প্রতিষ্ঠান</h1>
            <AppButton variant="primary" type="button" @click="openCreateModal">যোগ করুন</AppButton>
        </template>

            <!-- <AppEmpty
            v-if="instituteList.length === 0"
            title="কোনো প্রতিষ্ঠান নেই"
            description="একটি প্রতিষ্ঠান যোগ করতে 'যোগ করুন' বাটনে ক্লিক করুন"
        /> -->

        <div class="overflow-hidden border border-slate-200 bg-white shadow-lg shadow-slate-200/60 rounded-lg">
            <table class="min-w-full border-collapse text-left text-sm text-slate-700">
                <thead class="bg-slate-50">
                    <tr>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">ক্রমিক</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">নাম</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">ইমেইল</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">সেশন</th>
                        <th class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                    <tr v-for="(inst, index) in instituteList" :key="inst.id" class="hover:bg-slate-50">
                        <td class="px-5 py-4">{{ index + 1 }}</td>
                        <td class="px-5 py-4 font-medium">{{ inst.name }}</td>
                        <td class="px-5 py-4">{{ inst.email || '—' }}</td>
                        <td class="px-5 py-4">{{ inst.session || '—' }}</td>
                        <td class="px-5 py-4">
                            <div class="flex gap-2">
                                <NuxtLink
                                    to="/institute/edit"
                                    class="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition"
                                >
                                    এডিট
                                </NuxtLink>
                                <button
                                    @click="handleDelete(inst.id)"
                                    class="inline-flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 transition"
                                >
                                    ডিলিট
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </AppCard>

    <!-- Create Modal -->
    <AppModal title="প্রতিষ্ঠান তৈরি করুন" :open="showCreateModal" @close="handleClose">
        <ArsInstituteCreate @saved="handleSaved" />
    </AppModal>
</template>

<style lang="postcss" scoped>

</style>
