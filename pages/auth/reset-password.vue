<template>
  <div class="w-full">
    <div class="flex items-center mb-10">
      <BaseCustomIcon name="logo" customClass="w-[144px] h-8 text-primary-300" />
    </div>

    <!-- Flow 1: Create new password -->
    <div v-if="!isSuccess" class="w-full">
      <div class="mb-10">
        <h3 class="text-neutral-primary">Create new password <span aria-hidden="true">🔑</span></h3>
        <p class="body-small text-neutral-secondary mt-2">
          Your new password must be different from previously used passwords.
        </p>
      </div>

      <form @submit.prevent="onSubmit" class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <p class="label text-neutral-primary">New Password</p>
          <FormText
            v-model="newPassword"
            inputId="new-password"
            name="new_password"
            type="password"
            placeholder="Enter your password"
            :error="errors.newPassword"
            @input="validateField('newPassword')"
          />
        </div>

        <div class="flex flex-col gap-2">
          <p class="label text-neutral-primary">Confirm Password</p>
          <FormText
            v-model="confirmPassword"
            inputId="confirm-password"
            name="confirm_password"
            type="password"
            placeholder="Confirm your new password"
            :error="errors.confirmPassword"
            @input="validateField('confirmPassword')"
          />
        </div>

        <CommonButton
          title="Reset Password"
          type="submit"
          bgColor="bg-primary-300 hover:bg-primary-400 !h-12 rounded-xl"
          textColor="text-neutral-inverted button"
          :loading="isLoading"
          fullWidth
        />
      </form>
    </div>

    <!-- Flow 2: Success state -->
    <div v-else class="w-full">
      <div class="mb-10">
        <h3 class="text-neutral-primary">Password Reset Successful <span aria-hidden="true">🎉</span></h3>
        <p class="body-small text-neutral-secondary mt-2">
          Your password has been changed successfully. You can now log in with your new password.
        </p>
      </div>

      <CommonButton
        title="Proceed to Login"
        type="button"
        bgColor="bg-primary-300 hover:bg-primary-400 !h-12 rounded-xl"
        textColor="text-neutral-inverted button"
        fullWidth
        @click="goToLogin"
      />
    </div>
  </div>
</template>

<script setup>
import Joi from 'joi'
import { ref, onMounted } from 'vue'
import FormText from '~/components/common/input/FormText.vue'

definePageMeta({
  layout: 'auth'
})

const isLoading = ref(false)
const isSuccess = ref(false)

const newPassword = ref('')
const confirmPassword = ref('')
const errors = ref({})

const validationSchema = {
  newPassword: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'Password must be at least 8 characters',
      'any.required': 'New password is required'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Confirm password is required',
      'any.required': 'Confirm password is required'
    })
}

const validateField = (field) => {
  const values = {
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value
  }

  const schema =
    field === 'confirmPassword'
      ? Joi.object({
          newPassword: validationSchema.newPassword,
          confirmPassword: validationSchema.confirmPassword
        })
      : Joi.object({
          newPassword: validationSchema.newPassword
        })

  const { error } = schema.validate(values, { abortEarly: true })

  if (error) {
    const message = error.details[0].message

    if (field === 'newPassword') {
      errors.value.newPassword = message
      return
    }

    errors.value.confirmPassword = message
    return
  }

  if (field === 'newPassword') delete errors.value.newPassword
  if (field === 'confirmPassword') delete errors.value.confirmPassword
}

onMounted(() => {
  // Basic guard for UI flow: must have completed previous steps.
  if (!process.client) return

  const email = sessionStorage.getItem('reset_email')
  const otp = sessionStorage.getItem('reset_otp')

  if (!email || !otp) {
    navigateTo('/auth/forgot-password', { replace: true })
  }
})

const onSubmit = async () => {
  validateField('newPassword')
  validateField('confirmPassword')

  if (errors.value.newPassword || errors.value.confirmPassword) return

  isLoading.value = true
  await new Promise((r) => setTimeout(r, 700))
  isLoading.value = false
  isSuccess.value = true
}

const goToLogin = async () => {
  if (process.client) {
    sessionStorage.removeItem('reset_email')
    sessionStorage.removeItem('reset_otp')
  }

  await navigateTo('/login', { replace: true })
}
</script>
