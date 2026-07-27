<script setup >

const ui = useUiStore();
const widgetStore = useWidgetStore();
const classes = useClasses();
const response = ref();
const req = ref(true);
// const emit = defineEmits('handle-saved-from-parent')

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
        index: form.index.trim(),
      }
      
      await classes.create(data);
      ui.showToast('success', "ক্লাস যুক্ত হয়েছে।")
      ui.showWizedModal = false;

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
	<form @submit.prevent="handleSubmit" >

    <div class="flex items-center justify gap-4">
      <AppInputField label="ক্লাসের নাম লিখুন" :req="req" type="text" v-model="form.name" placeholder="যেমন: নবম " />
      <AppInputField label="ইনডেক্স" :req="req" type="number" v-model="form.index" placeholder="যেমন: 9" />
    </div>

    <div class="flex items-end mt-6">
      <AppButton type="submit" :variant="primary"> {{ ui.saveButtonText }} </AppButton>
    </div>
	</form>
</template>

<style>
</style>
