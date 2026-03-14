<template>
  <div class="w-full">
    <div class="flex items-center mb-10">
      <BaseCustomIcon name="logo" customClass="w-[144px] h-8 text-primary-300" />
    </div>

    <div class="mb-10">
      <h3 class="text-neutral-primary">Enter OTP <span aria-hidden="true">✅</span></h3>
      <p class="body-small text-neutral-secondary mt-2">
        We sent a 6-digit code to your email to verify your account
      </p>
    </div>

    <form @submit.prevent="onSubmit" class="flex flex-col gap-8">
      <div class="flex flex-col gap-3">
        <OtpInput v-model="otp" :length="6" />
        <p v-if="error" class="text-danger-300 text-xs">{{ error }}</p>
      </div>

      <CommonButton
        title="Verify Account"
        type="submit"
        bgColor="bg-primary-300 hover:bg-primary-400 !h-12 rounded-xl"
        textColor="text-neutral-inverted button"
        :loading="isLoading"
        fullWidth
      />

      <div class="flex items-center justify-center gap-2 pt-2">
        <p class="body-small text-neutral-secondary">Yet to receive OTP</p>

        <CommonButton
          :title="resendLabel"
          type="button"
          bgColor="bg-transparent hover:bg-transparent !p-0 !h-auto"
          textColor="body-small font-semibold text-primary-500 disabled:opacity-100 disabled:cursor-default"
          size="sm"
          :disabled="!canResend"
          @click="resendOtp"
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import Joi from 'joi'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import OtpInput from '~/components/common/otpInput.vue'

definePageMeta({
  layout: 'auth'
})

const otp = ref('')
const error = ref('')
const isLoading = ref(false)

const countdown = ref(19)
const canResend = computed(() => countdown.value <= 0)
const resendLabel = computed(() => {
  return canResend.value ? 'Resend OTP' : 'Reset in ' + countdown.value + 's'
})

let timerId = null

const startCountdown = () => {
  if (timerId) clearInterval(timerId)

  timerId = setInterval(() => {
    countdown.value = Math.max(0, countdown.value - 1)

    if (countdown.value === 0 && timerId) {
      clearInterval(timerId)
      timerId = null
    }
  }, 1000)
}

onMounted(() => {
  startCountdown()
})

onBeforeUnmount(() => {
  if (timerId) clearInterval(timerId)
})

const schema = Joi.string()
  .pattern(/^\d{6}$/)
  .required()
  .messages({
    'string.empty': 'OTP is required',
    'string.pattern.base': 'Enter the 6-digit OTP',
    'any.required': 'OTP is required'
  })

const onSubmit = async () => {
  const { error: validationError } = schema.validate(otp.value)

  if (validationError) {
    error.value = validationError.details[0].message
    return
  }

  error.value = ''
  isLoading.value = true

  if (process.client) {
    sessionStorage.setItem('reset_otp', otp.value)
  }

  await new Promise((r) => setTimeout(r, 600))
  await navigateTo('/auth/reset-password', { replace: true })
}

const resendOtp = () => {
  if (!canResend.value) return

  otp.value = ''
  error.value = ''
  countdown.value = 19
  startCountdown()
}
</script>
