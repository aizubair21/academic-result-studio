<script setup>
const ui = useUiStore();
const router = useRouter();
const institute = useInstitute();

definePageMeta({
    layout: 'app',
})

// Form state
const form = reactive({
    name: '',
    email: '',
    session: '',
    headSirName: '',
});

const loading = ref(true);

onMounted(async () => {
    try {
        const data = await institute.first();
        if (data) {
            form.name = data.name || '';
            form.email = data.email || '';
            form.session = data.session || '';
            form.headSirName = data.headSirName || '';
        }
    } catch (err) {
        ui.showToast('error', 'ডেটা লোড করতে সমস্যা হয়েছে: ' + err);
    } finally {
        loading.value = false;
    }
});

// Validation
const errors = computed(() => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'প্রতিষ্ঠানের নাম আবশ্যক';
    return errs;
});

const isValid = computed(() => Object.keys(errors.value).length === 0);

async function handleSubmit() {
    if (!isValid.value) return;

    ui.saving = true;

    try {
        await institute.update(1, {
            name: form.name.trim(),
            email: form.email.trim(),
            session: form.session.trim(),
            headSirName: form.headSirName.trim(),
        });

        ui.showToast('success', 'প্রতিষ্ঠান সফলভাবে আপডেট হয়েছে');
        router.push('/institute');
    } catch (err) {
        ui.showToast('error', 'আপডেট করতে সমস্যা হয়েছে: ' + err);
    } finally {
        ui.saving = false;
    }
}

function handleCancel() {
    router.push('/institute');
}
</script>

<template>
    <AppCard>
        <template #header>
            <h1 class="text-xl font-bold text-slate-900">প্রতিষ্ঠান সম্পাদনা</h1>
            <AppButton variant="secondary" type="button" @click="handleCancel">ফিরে যান</AppButton>
        </template>

        <div v-if="loading" class="py-8 text-center text-slate-500">
            লোড হচ্ছে...
        </div>

        <form v-else @submit.prevent="handleSubmit" class="space-y-6 max-w-2xl">
            <!-- Name -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    প্রতিষ্ঠানের নাম <span class="text-red-500">*</span>
                </label>
                <input
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="যেমন: মতিঝিল সরকারি বালক উচ্চ বিদ্যালয়"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    :class="{ 'border-red-500': errors.name }"
                />
                <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
            </div>

            <!-- Email -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    ইমেইল
                </label>
                <input
                    v-model="form.email"
                    type="email"
                    placeholder="example@school.edu.bd"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
            </div>

            <!-- Session -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    সেশন
                </label>
                <input
                    v-model="form.session"
                    type="text"
                    placeholder="যেমন: ২০২৪-২০২৫"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
            </div>

            <!-- Head Sir Name -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">
                    প্রধান শিক্ষকের নাম
                </label>
                <input
                    v-model="form.headSirName"
                    type="text"
                    placeholder="প্রধান শিক্ষকের নাম"
                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
            </div>

            <!-- Actions -->
            <div class="flex gap-3 pt-4 border-t">
                <AppButton
                    type="submit" variant="primary" icon="check">
                    {{ui.saveButtonText}}
                </AppButton>
                <AppButton
                    type="button"
                    variant="ghost"
                    icon="x"
                    @click="handleCancel" > 
                    বাতিল করুন 
                </AppButton>
            </div>
        </form>
    </AppCard>
</template>

<style lang="postcss" scoped>

</style>

