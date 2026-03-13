<template>
    <div class="otp-input-container">
      <div v-for="(digit, index) in otpArray" :key="index" class="otp-digit-container">
        <input
          ref="otpInputs"
          type="tel"
          maxlength="1"
          pattern="[0-9]*"
          inputmode="numeric"
          v-model="otpArray[index]"
          class="otp-digit-input"
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
  import { ref, computed, watch, onMounted } from 'vue';
  
  const props = defineProps({
    length: {
      type: Number,
      default: 4
    },
    modelValue: {
      type: String,
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  const otpInputs = ref([]);
  const otpArray = ref(Array(props.length).fill(''));
  
  // Watch for external modelValue changes
  watch(() => props.modelValue, (newValue) => {
    if (newValue) {
      const valueArray = newValue.toString().split('');
      otpArray.value = Array(props.length).fill('').map((_, i) => valueArray[i] || '');
    } else {
      otpArray.value = Array(props.length).fill('');
    }
  }, { immediate: true });
  
  // Watch internal array for changes to emit
  watch(otpArray, (newArray) => {
    const joinedValue = newArray.join('');
    emit('update:modelValue', joinedValue);
  }, { deep: true });
  
  // Computed property to check if OTP is completed
  const isCompleted = computed(() => {
    return otpArray.value.every(digit => digit !== '') && otpArray.value.length === props.length;
  });
  
  // Handle input in a field
  const handleInput = (index) => {
    // Only allow numbers
    otpArray.value[index] = otpArray.value[index].replace(/[^0-9]/g, '');
    
    // Move to next input if current one has a value
    if (otpArray.value[index] !== '' && index < props.length - 1) {
      otpInputs.value[index + 1].focus();
    }
  };
  
  // Handle keydown events
  const handleKeyDown = (event, index) => {
    // Handle backspace
    if (event.key === 'Backspace') {
      if (otpArray.value[index] === '') {
        // Current field is empty, move to previous field and select its content
        if (index > 0) {
          event.preventDefault();
          otpInputs.value[index - 1].focus();
          otpInputs.value[index - 1].select();
        }
      }
    } 
    // Handle left arrow key
    else if (event.key === 'ArrowLeft') {
      if (index > 0) {
        event.preventDefault();
        otpInputs.value[index - 1].focus();
        otpInputs.value[index - 1].select();
      }
    } 
    // Handle right arrow key
    else if (event.key === 'ArrowRight') {
      if (index < props.length - 1) {
        event.preventDefault();
        otpInputs.value[index + 1].focus();
        otpInputs.value[index + 1].select();
      }
    }
  };
  
  // Handle paste event
  const handlePaste = (event) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text');
    const pastedDigits = pastedData.replace(/\D/g, '').split('');
    
    for (let i = 0; i < props.length && i < pastedDigits.length; i++) {
      otpArray.value[i] = pastedDigits[i];
    }
    
    // Focus on the next empty input or the last one
    const nextEmptyIndex = otpArray.value.findIndex(digit => digit === '');
    if (nextEmptyIndex !== -1) {
      otpInputs.value[nextEmptyIndex].focus();
    } else {
      otpInputs.value[props.length - 1].focus();
    }
  };
  
  // Handle focus event
  const handleFocus = (event) => {
    // Select the content when focused
    event.target.select();
  };
  
  // Focus on first input when mounted
  onMounted(() => {
    if (otpInputs.value.length && otpArray.value[0] === '') {
      otpInputs.value[0].focus();
    }
  });
  </script>
  
  <style scoped>
.otp-input-container {
  @apply flex items-center justify-between sm:gap-4 gap-2;
}
  
  .otp-digit-container {
    flex: 1;
  }
  
  .otp-digit-input {
    width: 100%;
    height: 50px;
    text-align: center;
    font-size: 24px;
    border: 1px solid #D9D9DB;
    border-radius: 8px;
    background-color: transparent;
    -moz-appearance: textfield;
    box-sizing: border-box;
  }
  
  .otp-digit-input:focus {
    border-color: #4534B8;
    outline: none;
  }
  
  .otp-digit-input::-webkit-inner-spin-button,
  .otp-digit-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  </style>