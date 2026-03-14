<template>
  <div class="flex items-center justify-center sm:gap-4 gap-2">
    <div v-for="(digit, index) in otpArray" :key="index" class="w-12 sm:w-14">
      <input
        ref="otpInputs"
        type="tel"
        maxlength="1"
        pattern="[0-9]*"
        inputmode="numeric"
        v-model="otpArray[index]"
        class="w-full h-12 text-center text-2xl font-semibold rounded-lg border border-neutral-line bg-neutral-surface text-neutral-primary outline-none focus:border-primary-300"
        :data-index="index"
        placeholder=""
        @input="handleInput(index)"
        @keydown="handleKeyDown($event, index)"
        @paste="handlePaste"
        @focus="handleFocus"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  length: {
    type: Number,
    default: 6
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const otpInputs = ref([])
const otpArray = ref(Array(props.length).fill(''))

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      const valueArray = newValue.toString().split('')
      otpArray.value = Array(props.length)
        .fill('')
        .map((_, i) => valueArray[i] || '')
    } else {
      otpArray.value = Array(props.length).fill('')
    }
  },
  { immediate: true }
)

watch(
  otpArray,
  (newArray) => {
    emit('update:modelValue', newArray.join(''))
  },
  { deep: true }
)

const isCompleted = computed(() => {
  return otpArray.value.every((digit) => digit !== '') && otpArray.value.length === props.length
})

const handleInput = (index) => {
  otpArray.value[index] = otpArray.value[index].replace(/[^0-9]/g, '')

  if (otpArray.value[index] !== '' && index < props.length - 1) {
    otpInputs.value[index + 1].focus()
  }
}

const handleKeyDown = (event, index) => {
  if (event.key === 'Backspace') {
    if (otpArray.value[index] === '') {
      if (index > 0) {
        event.preventDefault()
        otpInputs.value[index - 1].focus()
        otpInputs.value[index - 1].select()
      }
    }
  } else if (event.key === 'ArrowLeft') {
    if (index > 0) {
      event.preventDefault()
      otpInputs.value[index - 1].focus()
      otpInputs.value[index - 1].select()
    }
  } else if (event.key === 'ArrowRight') {
    if (index < props.length - 1) {
      event.preventDefault()
      otpInputs.value[index + 1].focus()
      otpInputs.value[index + 1].select()
    }
  }
}

const handlePaste = (event) => {
  event.preventDefault()

  const pastedData = event.clipboardData.getData('text')
  const pastedDigits = pastedData.replace(/[^0-9]/g, '').split('')

  for (let i = 0; i < props.length && i < pastedDigits.length; i++) {
    otpArray.value[i] = pastedDigits[i]
  }

  const nextEmptyIndex = otpArray.value.findIndex((digit) => digit === '')

  if (nextEmptyIndex !== -1) {
    otpInputs.value[nextEmptyIndex].focus()
    return
  }

  otpInputs.value[props.length - 1].focus()
}

const handleFocus = (event) => {
  event.target.select()
}

onMounted(() => {
  if (otpInputs.value.length && otpArray.value[0] === '') {
    otpInputs.value[0].focus()
  }
})
</script>

