<template>
  <div class="card flex justify-content-center own-filter">
    <Dropdown
      v-if="type === 'default'"
      v-model="selectedOption"
      :options="items"
      :optionLabel="(option) => option.name"
      :placeholder="placeholder"
      @change="onChange"
      class=""
    >
      <template #dropdownicon>
        <BaseCustomIcon name="filter" />
      </template>
      <template #option="slotProps">
        <span class="">
          {{ slotProps.option.name }}
        </span>
      </template>
    </Dropdown>
    <MultiSelect
      v-if="type === 'multiselectWithChips'"
      v-model="selectedOption"
      :options="items"
      :optionLabel="(option) => option.header"
      :placeholder="placeholder"
      :maxSelectedLabels="3"
      class="bg-transparent w-20rem max-w-20rem"
    >
      <template #option="slotProps">
        <span>
          {{ slotProps.option.header }}
        </span>
      </template>
    </MultiSelect>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
  },
  placeholder: {
    type: String,
  },
  optionLabel: {
    type: String,
    default: "header",
  },
  optionLabelSingle: {
    type: String,
    default: "name",
  },
  type: {
    type: String,
    default: "default",
  },
});
const selectedOption = ref(props.modelValue);
const emit = defineEmits(["update:modelValue", "openModel", "openModelStatus"]);
const onChange = (e) => {
  emit("update:modelValue", e.value);
  if (e.value.value === "Assign") {
    emit("openModel");
  } else {
    emit("openModelStatus");
  }
};

// watch(
//   () => props.modelValue,
//   (value) => {
//     selectedOption.value = value;
//   }
// );

// Watch the selectedOption variable for changes
watch(selectedOption, (newValue) => {
  // Emit value

  emit("update:modelValue", newValue);
});
</script>

