<template>
  <div class="card flex rounded-lg justify-center items-center date-range-box w-full sm:w-fit ">
    <Calendar
      v-model="selectedDate"
      selectionMode="range"
      :manualInput="false"
      iconDisplay="input"
      showIcon
      :placeholder="placeholder"
      class="rounded-lg date-range h-[40px] w-full sm:w-fit min-w-[260px]"
    />
    <i class="pi pi-times closeIcon cursor-pointer mr-[16px]" @click="selectedDate=null" v-if="selectedDate"></i>
  </div>
</template>

<script setup>
const selectedDate = ref(null);
const props = defineProps({
  modelValue: {
    type: String,
  },
  placeholder: {
    type: String,
  },
});
const emit = defineEmits(["update:modelValue"]);
watch(() => selectedDate.value, (newValue) => {
  emit("update:modelValue", newValue);
});


</script>
