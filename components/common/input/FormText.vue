<template>
  <div class="flex flex-col gap-1 font-inter">
    <!-- Label -->
    <label
      v-if="label"
      :for="inputId"
      class="body-xsmall text-neutral-500 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-danger-300">*</span>
    </label>

    <!-- Date Picker -->
    <DatePicker
      v-if="type === 'date'"
      v-model="internalValue"
      :name="name"
      :placeholder="placeholder"
      showIcon
      iconDisplay="input"
      class="h-10"
      :disabled="disabled"
      :class="{ 'p-invalid': error }"
      @update:modelValue="emitChange"
    />

    <!-- Textarea -->
    <Textarea
      v-else-if="type === 'textarea'"
      v-model="internalValue"
      :name="name"
      :placeholder="placeholder"
      autoResize
      rows="5"
      class="border px-3 py-2 body-small focus:outline-none"
      :disabled="disabled"
      :class="{ 'p-invalid': error }"
      style="box-shadow: 0px 1px 2px 0px #1018280d"
      
      @update:modelValue="emitChange"
    />

    <!-- Checkbox -->
    <Checkbox
      v-else-if="type === 'checkbox'"
      v-model="internalValue"
      :inputId="inputId"
      :name="name"
      :binary="true"
      :disabled="disabled"
      :class="{ 'p-invalid': error }"
      @update:modelValue="emitChange"
    />

    <!-- Password -->
    <Password
      v-else-if="type === 'password'"
      v-model="internalValue"
      :name="name"
      :placeholder="placeholder"
      toggleMask
      :feedback="false"
      class="h-10"
      :inputProps="{ autocomplete: 'on', id: inputId }"
      :disabled="disabled"
      @update:modelValue="emitChange"
    />

    <!-- Default Input -->
    <InputText
      v-else
      v-model="internalValue"
      :id="inputId"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="w-full h-10 shadow-none"
      :class="{ 'p-invalid': error }"
      @update:modelValue="emitChange"
    />

    <!-- Error Message -->
    <span
      v-if="error"
      class="text-danger-300 mt-1 body-xsmall"
    >
      {{ error }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: [String, Number, Boolean, Date],
  name: String,
  placeholder: { type: String, default: '' },
  label: String,
  inputId: String,
  type: { type: String, default: 'text' },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => (internalValue.value = newVal)
)

const emitChange = (val) => {
  emit('update:modelValue', val)
}
</script>


