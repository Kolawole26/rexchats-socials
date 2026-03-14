<template>
  <div class="flex flex-col gap-1 font-inter">
    <!-- Label -->
    <label v-if="label" class="body-xsmall text-neutral-500 mb-2">
      {{ label }}
      <span v-if="required" class="text-danger-300">*</span>
    </label>

    <!-- Multi Select -->
    <MultiSelect
      v-if="multiple"
      v-model="internalValue"
      :name="name"
      :options="options"
      :optionLabel="itemText"
      :optionValue="itemValue"
      class="h-12 bg-card-light dark:bg-card-dark"
      :showClear="showClear"
      :placeholder="placeholder"
      :disabled="disabled"
      @change="emitChange"
    />

    <!-- Single Select -->
    <Dropdown
      v-else
      v-model="internalValue"
      :name="name"
      :options="options"
      :optionLabel="itemText"
      :optionValue="itemValue"
      class="w-full h-12 px-3 dark:bg-transparent"
      :showClear="showClear"
      :placeholder="placeholder"
      :disabled="disabled"
      :option-disabled="isOptionDisabled"
      @change="emitChange"
    >
      <!-- Custom Option Template -->
      <template v-if="action" #option="{ option }">
        <div class="flex items-center gap-2 w-full">
          <img
            v-if="option[itemLogo]"
            :src="option[itemLogo]"
            alt="logo"
            class="w-6 h-6 rounded-full"
          />
          <div>
            <p class="body-small">{{ option[itemText] }}</p>
            <p class="body-small text-neutral-400">{{ option[itemValue] }}</p>
          </div>
        </div>
      </template>
    </Dropdown>

    <!-- Error Message -->
    <span
      v-if="error && !hideError"
      class="text-danger-300 mt-1 body-xsmall"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Array, Object],
  name: { type: String, required: true },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  options: { type: Array, default: () => [] },
  itemText: { type: String, default: 'name' },
  itemValue: { type: String, default: 'value' },
  itemLogo: { type: String, default: 'logo' },
  showClear: { type: Boolean, default: false },
  action: { type: Boolean, default: false },
  error: { type: String, default: '' },
  hideError: { type: Boolean, default: false },
  disabledOption: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue', 'change', 'onAction'])

const internalValue = ref(props.modelValue)

// Keep internal and external value synced
watch(
  () => props.modelValue,
  (newVal) => (internalValue.value = newVal)
)

// Emit value changes
const emitChange = (e) => {
  emit('update:modelValue', e.value)
  emit('change', e.value)
}

// Disable specific option dynamically
const isOptionDisabled = (option) =>
  option[props.itemText] === props.disabledOption

// Optional action callback
const actionOption = (optionValue) => {
  emit('onAction', optionValue)
}
</script>
