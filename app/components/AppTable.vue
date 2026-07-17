<script lang="ts" setup>
const props = defineProps({
  headers: { type: Array, default: () => [] },
  rows: { type: Array, default: () => [] },
})
</script>

<template>
  <div class="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg shadow-slate-200/60">
    <table class="min-w-full border-collapse text-left text-sm text-slate-700">
      <thead class="bg-slate-50">
        <tr>
          <th v-for="(header, index) in headers" :key="index" class="border-b border-slate-200 px-5 py-4 font-semibold text-slate-600">{{ header }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 bg-white">
        <tr v-for="(row, rowIndex) in rows" :key="rowIndex" class="hover:bg-slate-50">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="px-5 py-4">{{ cell }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
