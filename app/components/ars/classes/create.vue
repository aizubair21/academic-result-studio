<script setup >

const ui = useUiStore();
const widgetStore = useWidgetStore();
const classes = useClasses();
const response = ref();

const form = reactive({
  name: '',
  index: '',
});

const analyseClasses = ref(
  {
    value : [
      'Play','One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    ], 
  }
)

const dymmyClasses = ref([]);

const handleSubmit = async () => {
  ui.saving = true;
  const dummyClas = dymmyClasses.value.map( item => ({name: item}));

  try {
      const data = {
        name: form.name.trim(),
      }      
      console.log('Before Create : ' + data);
      
      await classes.create(data);
      ui.showToast('success', "ক্লাস যুক্ত হয়েছে।")

    } catch (error) {
      ui.showToast('error', error);
  }
    
  ui.saving = false
}



const handleToggleDuppyClasses = (el) => {
  var index = dymmyClasses.value.indexOf(el);

    if (index === -1) {
        dymmyClasses.value.push(el);
    } else {
        dymmyClasses.value.splice(index, 1);
    }
}

</script>


<template>
	<form @submit.prevent="handleSubmit" v-if="widgetStore.workflow.current == 'classes'">
		<!-- <label class="block text-sm font-medium text-gray-700 mb-1.5">
      ক্লাসের নাম <span class="text-red-500">*</span>
    </label>
    <input
      v-model="form.name"
      type="text"
      required
      placeholder="যেমন: নবম"
      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      
    /> -->

    <div class="flex items-center justify-between">
      <AppInputField label="ক্লাসের নাম লিখুন" req="true" type="text" v-model="form.name" placeholder="যেমন: নবম " />
      <AppInputField label="ইনডেক্স" req="true" type="number" v-model="form.index" placeholder="যেমন: 9" />
    </div>

    <div class="flex items-end">
      <AppButton type="submit" :variant="primary"> {{ ui.saveButtonText }} </AppButton>
    </div>
	</form>
</template>

<style>
</style>
