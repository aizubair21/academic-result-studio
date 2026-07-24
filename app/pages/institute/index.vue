<script setup>
const ui = useUiStore();
const institute = ref([]);

definePageMeta({
    layout: 'app',
})


onMounted( async () => {
    const inst = useInstitute()
    institute.value = await inst.first();
    console.log(institute.value.name);
})

</script>


<template>
    <AppCard>
        <template #header>
             <h1 class="text-3xl font-bold text-slate-900"> প্রতিষ্ঠান </h1>
            <AppButton @click="ui.showWizedModal = true" type="primary" > যোগ করুন </AppButton>
        </template>

        <div>
            <div class="grid gap-4">
                <div class="border-b p-5">
                    <p class="text-sm font-medium">প্রতিষ্ঠানের নাম</p>
                    <p class="mt-2 text-lg font-semibold ">{{ institute.name || '' }}</p>
                </div>
                <div class="border-b p-5">
                    <p class="text-sm font-medium">ইমেইল</p>
                    <p class="mt-2 text-lg font-semibold "> {{ institute.email || 'ইমেইল নেই' }} </p>
                </div>
                <div class="border-b p-5">
                    <p class="text-sm font-medium">সেশন</p>
                    <p class="mt-2 text-lg font-semibold ">{{ institute.session || 'শেষন নেই' }}</p>
                </div>
            </div>
        </div>
    </AppCard>


    <!-- create modal  -->
    <AppModal title="Setup Institute" :open="ui.showWizedModal" @close="ui.showWizedModal = false" >
        <ArsInstituteCreate />
    </AppModal>
</template>

<style>
	
</style>