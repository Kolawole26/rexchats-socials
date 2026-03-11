
<template>
  <div class="flex flex-col gap-1 font-inter">
    <label v-if="label" class="body-xsmall text-neutral-500 mb-1">
      {{ label }}
    </label>

    <div class="flex sm:gap-4 gap-2">
      <div
        v-for="option in options"
        :key="option.value"
        class="flex items-center gap-2 sm:px-[37px] px-2 py-[10.5px] rounded-md cursor-pointer bg-neutral-20 transition w-full"
        :class="{
          'bg-primary-50 dark:bg-primary-300': modelValue === option.value,
          'hover:bg-neutral-30': !disabled && !option.disabled,
          'opacity-50 cursor-not-allowed': disabled || option.disabled
        }"
        @click="handleOptionClick(option.value)"
      >
        <RadioButton
          :inputId="`${name}-${option.value}`"
          :name="name"
          :value="option.value"
          :disabled="disabled || option.disabled"
          :modelValue="modelValue"
          @update:modelValue="updateValue"
        />
        <label
          :for="`${name}-${option.value}`"
          class="body-small select-none"
          :class="{
            'text-neutral-500': !disabled && !option.disabled,
            'text-neutral-300': disabled || option.disabled
          }"
        >
          {{ option.label }}
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number, Boolean],
    default: null
  },
  label: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  orientation: {
    type: String,
    default: 'horizontal'
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const handleOptionClick = (value) => {
  if (!props.disabled) {
    updateValue(value)
  }
}

const updateValue = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>