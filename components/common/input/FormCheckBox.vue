<template>
  <div class="flex flex-col gap-1 font-inter">
    <label v-if="label" class="body-xsmall text-neutral-500 mb-1">
      {{ label }}
    </label>

    <div class="flex-col sm:gap-4 gap-2">
      <div
        v-for="option in options"
        :key="option.key || option.value"
        class="flex items-center gap-2 sm:px-3 px-2 py-[14px] rounded-lg cursor-pointer bg-neutral-muted mb-4 transition w-full"
        :class="{
          'bg-primary-50': modelValue.includes(option.name || option.value),
          'hover:bg-neutral-30': !disabled && !option.disabled,
          'cursor-not-allowed': disabled || option.disabled
        }"
      >
        <Checkbox
          v-model="selectedValues"
          :inputId="option.key || option.value"
          :name="name"
          :value="option.name || option.value"
          :disabled="disabled || option.disabled"
        />
        <label
          :for="option.key || option.value"
          class="label select-none cursor-pointer"
          :class="{
            'text-neutral-text_primary': !disabled && !option.disabled,
            'text-primary-300': disabled || option.disabled
          }"
        >
          {{ option.name || option.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: String,
  options: Array,
  modelValue: {
    type: Array,
    default: () => []
  },
  label: String,
  disabled: Boolean
})

const emit = defineEmits(['update:modelValue', 'change'])

// Create a computed property with getter/setter for v-model
const selectedValues = computed({
  get: () => props.modelValue,
  set: (newValue) => {
    emit('update:modelValue', newValue)
    emit('change', newValue)
  }
})
</script>