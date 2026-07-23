<script setup>
definePageMeta({
    layout: 'app',
})
</script>


<template>
    <div class="rounded-[2rem] p-3">
        <div class="flex items-center justify-between border-b mb-6 p-5">
            <h1 class="text-3xl font-bold text-slate-900"> প্রতিষ্ঠান </h1>
            <AppButton type="primary" > যোগ করুন </AppButton>
        </div>

        <div class="mb-6 flex items-center justify-between gap-4 rounded-3xl bg-slate-900/80 p-5">
            <h2 class="text-2xl font-semibold text-white">ABC উচ্চ বিদ্যালয়</h2>
        </div>
        <div class="grid gap-4">
            <div class="border-b p-5">
                <p class="text-sm font-medium">প্রতিষ্ঠানের নাম</p>
                <p class="mt-2 text-lg font-semibold ">ABC উচ্চ বিদ্যালয়</p>
            </div>
            <div class="border-b p-5">
                <p class="text-sm font-medium">ইমেইল</p>
                <p class="mt-2 text-lg font-semibold ">abc@gmail.com</p>
            </div>
            <div class="border-b p-5">
                <p class="text-sm font-medium">সেশন</p>
                <p class="mt-2 text-lg font-semibold ">২০২৪-২০২৫</p>
            </div>
        </div>
    </div>
</template>


<style>
	
</style>