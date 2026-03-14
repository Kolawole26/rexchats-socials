<template>
  <div class="w-full">
    <div class="flex items-center mb-10">
      <BaseCustomIcon name="logo" customClass="w-[144px] h-8 text-primary-300" />
    </div>

    <div class="mb-10">
      <h3 class="text-neutral-primary">Recover your account <span aria-hidden="true">🧑🏻‍💻</span></h3>
      <p class="body-small text-neutral-secondary mt-2">
        Enter your Email address. We will send you a 6-digit verification code.
      </p>
    </div>

    <form @submit.prevent="onSubmit" class="flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <p class="label text-neutral-primary">Email Address</p>
        <FormText
          v-model="email"
          inputId="recover-email"
          name="email"
          placeholder="example@mail.com"
          :error="errors.email"
          @input="validateField('email')"
        />
      </div>

      <CommonButton
        title="Generate OTP"
        type="submit"
        bgColor="bg-primary-300 hover:bg-primary-400 !h-12 rounded-xl"
        textColor="text-neutral-inverted button"
        :loading="isLoading"
        fullWidth
      />

      <div class="flex justify-center gap-2 pt-2">
        <p class="body-small text-neutral-secondary">Remember your password?</p>
        <NuxtLink to="/login" class="body-small font-semibold text-primary-500 hover:underline">Log In</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import Joi from 'joi'
import { ref } from 'vue'
import FormText from '~/components/common/input/FormText.vue'

definePageMeta({
  layout: 'auth'
})

const email = ref('')
const isLoading = ref(false)
const errors = ref({})

const validationSchema = {
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': 'Email address is required',
      'string.email': 'Enter a valid email address',
      'any.required': 'Email address is required'
    })
}

const validateField = (field) => {
  const { error } = validationSchema[field].validate(email.value)

  if (error) {
    errors.value[field] = error.details[0].message
    return
  }

  delete errors.value[field]
}

const onSubmit = async () => {
  validateField('email')
  if (errors.value.email) return

  isLoading.value = true

  if (process.client) {
    sessionStorage.setItem('reset_email', email.value)
  }

  await new Promise((r) => setTimeout(r, 600))
  await navigateTo('/auth/forgot-password/otp', { replace: true })
}
</script>
